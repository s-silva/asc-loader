const loader = require("@assemblyscript/loader");

module.exports = function (deps) {
  ${wasm}
  return new Promise(function(resolve) {
    loader.instantiate(asmInput, deps).then(function (result) {
      resolve(result.exports);
    })
  })
}
