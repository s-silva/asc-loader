const { webpack } = require('@webpack-utilities/test')

describe('Source Map', () => {
  test('Default', () => {
    const config = {
      loader: {
        test: /\.ts$/,
        options: {
          optimize: true,
          sourceMap: true
        }
      }
    }

    return webpack('source-map/index.js', config).then((stats) => {
      const mod =  stats.toJson().modules
        .find(m => m.id === './source-map/source-map.ts')

      expect(mod.source).toMatchSnapshot()
    })
  })
})
