var split = require('split2')
var eol = require('os').EOL

var renderer = require('./lib/renderer')
var levels = require('./lib/levels')

module.exports = garnish

function garnish (opt) {
  opt = opt || {}

  var loggerLevel = opt.level || 'debug'
  var render = renderer.create(opt.name)

  return split(parse)

  function parse (line) {
    try {
      var obj = JSON.parse(line)

      if (obj.name === 'http' && obj.message === 'request') return
      if (typeof obj.level === 'number') toBunyan(obj)

      // check if we need to style it
      if (!renderer.isStyleObject(obj)) return line + eol
      obj.level = obj.level || 'info'

      // allow user to filter to a specific level
      if (!levels.valid(loggerLevel, obj.level)) return

      // errors should be formatted differently
      if (typeof obj.err === 'object') return renderer.renderError(obj) + eol

      if (typeof obj.message === 'object') {
        return renderer.renderObject(obj) + eol
      }

      return render(obj) + eol
    } catch (e) {
      return line + eol
    }
  }
}

// mutate a bole log to bunyan log
// obj -> null
function toBunyan (obj) {
  if (obj.msg && !obj.message) {
    obj.message = obj.msg
    delete obj.msg
  }

  if (typeof obj.level === 'number') {
    if (obj.level === 20) obj.level = 'debug'
    if (obj.level === 30) obj.level = 'info'
    if (obj.level === 40) obj.level = 'warn'
    if (obj.level === 50) obj.level = 'error'
  }
}
