var fs   = require('fs');
var path = require('path');

var instantiate = fs.readFileSync(__dirname + '/instantiate.js', 'utf-8');

module.exports = {
  compile: function (wasm, file) {
    var length = wasm.length
    var buffer = []
    for (var i = 0; i < wasm.length; i += 1) {
      buffer.push(wasm[i])
    }
    var iwasm = null

    if (file) {
      iwasm = `var asmInput = fetch(${file})`
    } else {
      iwasm = `
        var asmInput = new ArrayBuffer(${wasm.length})
        var uint8 = new Uint8Array(asmInput)
        uint8.set([${buffer.join(',')}])
      `
    }

    return instantiate.replace('${wasm}', iwasm)
  }
}
