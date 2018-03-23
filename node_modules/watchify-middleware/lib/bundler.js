var createWatchify = require('watchify')
var EventEmitter = require('events').EventEmitter
var debounce = require('debounce')
var concat = require('concat-stream')
var assign = require('object-assign')
var stripAnsi = require('strip-ansi')
var parseError = require('./parse-error')

module.exports = bundler
function bundler (browserify, opt) {
  opt = opt || {}
  var emitter = new EventEmitter()
  var delay = opt.delay || 0
  var closed = false
  var pending = false
  var time = Date.now()
  var updates = []
  var errorHandler = opt.errorHandler
  if (errorHandler === true) {
    errorHandler = defaultErrorHandler
  }

  var watchify = createWatchify(browserify, assign({}, opt, {
    // we use our own debounce, so make sure watchify
    // ignores theirs
    delay: 0
  }))
  var contents = null

  emitter.close = function () {
    if (closed) return
    closed = true
    if (watchify) {
      // needed for watchify@3.0.0
      // this needs to be revisited upstream
      setTimeout(function () {
        watchify.close()
      }, 200)
    }
  }

  var bundleDebounced = debounce(bundle, delay)
  watchify.on('update', function (rows) {
    if (closed) return
    updates = rows
    pending = true
    time = Date.now()
    emitter.emit('pending')
    bundleDebounced()
  })

  emitter.bundle = function () {
    if (closed) return
    time = Date.now()
    if (!pending) {
      pending = true
      process.nextTick(function () {
        emitter.emit('pending')
      })
    }
    bundle()
  }

  // initial bundle
  if (opt.initialBundle !== false) {
    emitter.bundle()
  }

  return emitter

  function bundle () {
    if (closed) {
      update()
      return
    }

    var didError = false
    var outStream = concat(function (body) {
      if (!didError) {
        contents = body

        var delay = Date.now() - time
        emitter.emit('log', {
          contentLength: contents.length,
          elapsed: Math.round(delay),
          level: 'info',
          type: 'bundle'
        })

        bundleEnd()
      }
    })

    var wb = watchify.bundle()
    // it can be nice to handle errors gracefully
    if (typeof errorHandler === 'function') {
      wb.once('error', function (err) {
        err.message = parseError(err)
        contents = errorHandler(err) || ''

        didError = true
        bundleEnd()
        emitter.emit('bundle-error', err)
      })
    } else {
      wb.once('error', function (err) {
        err.message = parseError(err)
        emitter.emit('error', err)
        emitter.emit('bundle-error', err)
      })
    }
    wb.pipe(outStream)

    function bundleEnd () {
      update()
    }
  }

  function update () {
    if (closed) return
    if (pending) {
      pending = false
      emitter.emit('update', contents, updates)
      updates = []
    }
  }
}

function defaultErrorHandler (err) {
  console.error('%s', err)
  var msg = stripAnsi(err.message)
  return ';console.error(' + JSON.stringify(msg) + ');'
}
