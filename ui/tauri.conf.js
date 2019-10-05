const
  path = require('path'),
  distDir = path.resolve(__dirname, './dist/spa')

module.exports = function () {
  return {
    build: {
      distDir: distDir,
      APP_URL: 'http://localhost:7551'  // must use a localhost server for now
    },
    ctx: {},
    tauri: {
      embeddedServer: {
        active: true
      },
      bundle: {
        active: true
      },
      whitelist: {
        all: true
      },
      window: {
        title: 'Amethyst Editor'
      },
      security: {
        csp: 'default-src data: filesystem: ws: http: https: \'unsafe-eval\' \'unsafe-inline\''
      }
    }
  }
}
