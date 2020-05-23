var fs    = require('fs');
var path  = require('path');
var asc   = require('assemblyscript/cli/asc');

var loaderUtils     = require('loader-utils');
var validateOptions = require('schema-utils');

var schema    = require('./options.json');
var injectors = require('./injectors');

/**
 * Stream the file into memory so we don't
 * have to create temporary files on each compilation.
 * @param  {Function} cb Callback
 * @return {Stream}      Memory stream
 */
function createMemoryStream(cb) {
  var stream = [];
  var data = [];
  stream.write = function(chunk) {
    data.push(chunk.toString());
  }
  stream.reset = function() {
    stream.length = 0;
  }
  stream.toString = function() {
    return data.join('\n');
  }
  return stream;
}

/**
 * Compile the input file into WASM.
 * This isn't compiling the source directly since the
 * compiler will need to read all the dependencies separately.
 * @param  {Object}   context  Loader context
 * @param  {String}   input    Input file path
 * @param  {Object}   options  Options to decode
 * @param  {Function} cb       Callback function (error, output data)
 */
function compile(context, input, options, cb) {
  var params   = [ path.resolve(input), '--binaryFile', 'binary' ];
  var compiled = { binary: null };
  var streams  = {
    out: createMemoryStream(),
    err: createMemoryStream()
  };

  if (options.optimize) {
    if (options.optimize === 'size') {
      params.push('-O3z');
      params.push('--converge');
    } else if (options.optimize === 'speed') {
      params.push('-O3');
    } else if (options.optimize === 'release') {
      params.push('-O --noAssert');
    } else if (options.optimize === 'debug') {
      params.push('--debug');
    } else {
      params.push('-O');
    }
  }

  // todo: this needs to be improved
  if (options.sourceMap) params.push('--sourceMap');

  if (options.importMemory) params.push('--importMemory');
  if (options.noExportMemory) params.push('--noExportMemory');
  if (options.use) {
    for (var i = 0; i < options.use.length; i++) {
      params.push('--use');
      params.push(options.use[i]);
    }
  }

  asc.ready.then(() => {
    var ranOnce = false; // asc.main returns twice?
    asc.main(params, {
      stdout: streams.out,
      stderr: streams.err,
      readFile: function (name) {
        try {
          const file = path.resolve(name)
          const data = fs.readFileSync(file, 'utf-8')
          context.addDependency(file);
          return data
        } catch (err) {
          throw err
        }
      },
      writeFile: function (name, contents) {
        return compiled[name] = contents
      }
    }, function(err) {
      if (ranOnce) return;
      else ranOnce = true;

      if (err) return cb(new Error(streams.err.toString()));
      return cb(null, compiled);
    })
  })
}

/**
 * Webpack loader based on 'file-loader'.
 * @param  {String} content Source file content
 */
function loader(content) {
  var self = this;
  var callback = this.async();
  var options = loaderUtils.getOptions(this);

  validateOptions(schema, options, {
    name: 'ASC Loader',
    baseDataPath: 'options',
  });

  var context = options.context || this.rootContext;

  var url = loaderUtils.interpolateName(
    this,
    options.name || '[contenthash].[ext]',
    {
      context,
      content,
      regExp: options.regExp,
    }
  );

  var outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, this.resourcePath, context);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  var publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, this.resourcePath, context);
    } else {
      publicPath = `${
        options.publicPath.endsWith('/')
          ? options.publicPath
          : `${options.publicPath}/`
      }${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }


  return compile(self, this.resourcePath, options, function (err, output) {
    if (err) return callback(err);

    var sourceMap = output['binary.map']
    var injected = injectors.compile(output['binary'],
      options.build ? publicPath : null);

    if (options.build) {
      self.emitFile(outputPath, output['binary']);
    }

    if (options.sourceMap && sourceMap && typeof sourceMap === 'string') {
      sourceMap = JSON.parse(sourceMap)
    } else {
      // just making sure we're not passing an invalid source map
      sourceMap = undefined
    }

    return callback(err, injected, sourceMap);
  });
}

exports.default = loader;
