var padRight = require('pad-right')

var colors = {
  debug: 'cyan',
  info: 'dim',
  warn: 'yellow',
  error: 'red'
}

var padLen = Object.keys(colors).reduce(function (prev, a) {
  return Math.max(prev, a.length)
}, 0)

var levels = Object.keys(colors)

// whether the message level is valid for the given logger
module.exports.valid = function (logLevel, msgLevel) {
  var levelIdx = levels.indexOf(logLevel)
  var msgIdx = levels.indexOf(msgLevel)
  if (msgIdx === -1 || levelIdx === -1) return true
  return msgIdx >= levelIdx
}

// stringify with padding
module.exports.stringify = function (level) {
  return padRight(level, padLen, ' ')
}

// get a level's default color
module.exports.color = function (level) {
  return colors[level]
}

module.exports.maxLength = padLen
