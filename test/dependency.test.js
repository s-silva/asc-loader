const { webpack } = require('@webpack-utilities/test')

describe('Dependency', () => {
  test('Default', () => {
    const config = {
      loader: {
        test: /\.ts$/,
        options: {
          optimize: true
        }
      }
    }

    return webpack('dependency/index.js', config).then((stats) => {
      const mod =  stats.toJson().modules
        .find(m => m.id === './dependency/dependency.ts')

      expect(mod.source).toMatchSnapshot()
    })
  })
})
