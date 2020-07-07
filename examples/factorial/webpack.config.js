const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: './src/index.js',
    devServer: {
      contentBase: './dist',
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [ {
        test: /\.ts$/,
        include: /src\/assembly/,
        use: [
          {
            loader: 'asc-loader',
            options: {
              name: 'static/wasm/[name].[hash:8].wasm',
              build: argv.mode === 'production',
              optimize: '-O',
              importMemory: true,
              use: [ 'Math=JSMath' ]
            }
          }
        ]
      } ]
    }
  }
};
