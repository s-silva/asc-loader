const { webpack } = require('@webpack-utilities/test')

describe('Exports', () => {
  test('Default', () => {
    const config = {
      loader: {
        test: /\.ts$/,
        options: {
          optimize: true
        }
      }
    }

    return webpack('loader/index.js', config).then((stats) => {
      const mod =  stats.toJson().modules
        .find(m => m.id === './loader/loader.ts')

      expect(mod.source).toMatchSnapshot()
    })
  })
})
