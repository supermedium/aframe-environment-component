var mapLimit = require('map-limit')
var net = require('net')
var DEFAULT_MAX_PORT = 65535

module.exports = getPorts
function getPorts (basePorts, maxPort, cb) {
  if (!Array.isArray(basePorts)) {
    throw new TypeError('must provide array of ports as first argument')
  }
  if (typeof maxPort !== 'number') {
    cb = maxPort
    maxPort = DEFAULT_MAX_PORT
  }
  if (typeof cb !== 'function') {
    throw new TypeError('must provide callback function')
  }
  if (!isFinite(maxPort)) {
    throw new TypeError('maxPort must be a finite number')
  }

  var usedPorts = []
  mapLimit(basePorts, 1, function (base, next) {
    getNextPort(base, function (err, port) {
      if (err) return next(new Error('no ports found after ' + base))
      next(null, port)
    })
  }, cb)

  function getNextPort (basePort, cb) {
    // skip used ports
    while (basePort < maxPort && usedPorts.indexOf(basePort) >= 0) {
      basePort++
    }

    if (basePort >= maxPort) {
      return process.nextTick(function () {
        cb(new Error('no open ports'))
      })
    }

    var c = net.connect(basePort, function () {
      c.destroy()
      getNextPort(basePort + 1, cb)
    })
    c.on('error', function () {
      usedPorts.push(basePort)
      cb(null, basePort)
    })
  }
}
