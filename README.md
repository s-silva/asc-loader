[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]

# ASC Loader
AssemblyScript loader for Webpack.

## Installation

```bash
# npm
npm i -D asc-loader
npm i -D @assemblyscript/loader
npm i -D assemblyscript

# yarn
yarn add -D asc-loader
yarn add -D @assemblyscript/loader
yarn add -D assemblyscript
```

## Configuration

**`webpack.config.js`**
```js
module.exports = {
  module: {
    rules: [ {
      test: /\.ts$/,
      include: /src\/assembly/,
      use: [
        {
          loader: 'asc-loader',
          options: {
            name: 'static/wasm/[name].[hash:8].wasm',
            build: false, /* enable in production */
            optimize: '-O',
            importMemory: true,
            use: [ 'Math=JSMath' ]
          }
        }
      ]
    } ]
  }
}
```

### Alternative Configuration

**`webpack.config.js`**
```js
module.exports = {
  module: {
    rules: [ {
      test: /\.ts$/,
      use: 'asc-loader',
      include: /src\/assembly/,
      options: {
        name: 'static/wasm/[name].[hash:8].wasm',
        build: false, /* enable in production */
        optimize: '-O',
        importMemory: true,
        use: [ 'Math=JSMath' ]
      }
    } ]
  }
}
```

## Examples

* [Factorial Example](https://github.com/s-silva/asc-loader/tree/master/examples/factorial)

## Create React App

This also works on Create React App, just make sure that the loader is placed in the right place in the configuration file.

## Python SimpleHTTPServer

If you're using SimpleHTTPServer on Python to run production builds, please make sure that your Python version supports WASM MIME type detection.

If not, you can simply use this script to specify the MIME Type.

```python
import SimpleHTTPServer
import SocketServer

PORT = 8000

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
  pass

Handler.extensions_map['.wasm'] = 'application/wasm'

httpd = SocketServer.TCPServer(("", PORT), Handler)
httpd.serve_forever()
```

[npm]: https://img.shields.io/npm/v/asc-loader.svg
[npm-url]: https://npmjs.com/package/asc-loader

[node]: https://img.shields.io/node/v/asc-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/s-silva/asc-loader.svg
[deps-url]: https://david-dm.org/s-silva/asc-loader

[tests]: https://travis-ci.org/s-silva/asc-loader.svg?branch=master
[tests-url]: https://travis-ci.org/s-silva/asc-loader
