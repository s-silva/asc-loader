# ASC Loader
AssemblyScript loader for Webpack.

## Installation

```bash
npm i -D asc-loader
yarn add -D asc-loader
```

## Configuration

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
