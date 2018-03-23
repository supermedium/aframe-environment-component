var createBundler = require('./lib/bundler')

module.exports = function watchifyMiddleware (browserify, opt) {
  var emitter = createEmitter(browserify, opt)
  return emitter.middleware
}

module.exports.emitter = createEmitter

module.exports.getWatchifyVersion = function () {
  return require('watchify/package.json').version
}

function createEmitter (browserify, opt) {
  var bundler = createBundler(browserify, opt)
  var pending = false
  var contents = ''

  bundler.on('pending', function () {
    pending = true
  })

  bundler.on('update', function (data) {
    pending = false
    contents = data
  })

  bundler.middleware = function middleware (req, res) {
    if (pending) {
      bundler.emit('log', {
        level: 'debug',
        type: 'request',
        message: 'bundle pending'
      })

      bundler.once('update', function () {
        bundler.emit('log', {
          level: 'debug',
          type: 'request',
          message: 'bundle ready'
        })
        submit(req, res)
      })
    } else {
      submit(req, res)
    }
  }

  return bundler

  function submit (req, res) {
    res.setHeader('content-type', 'application/javascript; charset=utf-8')
    res.setHeader('content-length', contents.length)
    res.statusCode = req.statusCode || 200
    res.end(contents)
  }
}
