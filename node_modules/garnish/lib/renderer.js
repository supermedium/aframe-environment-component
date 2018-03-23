var chalk = require('chalk')
var stripUrl = require('url-trim')
var now = require('right-now')
var levels = require('./levels')
var padLeft = require('pad-left')
var padRight = require('pad-right')
var prettyBytes = require('prettier-bytes')
var prettyMs = require('pretty-ms')

var paddings = {
  method: 6,
  statusCode: 3,
  contentLength: 8,
  elapsed: 7
}

var leftAligns = [ 'method' ]

var ansiStyles = Object.keys(chalk.styles)
var keys = [
  'time',
  'level',
  'elapsed',
  'contentLength',
  'message',
  'method',
  'statusCode',
  'url',
  'type',
  'name'
]

var startTime = now()

exports.isStyleObject = function (data) {
  // skip false/undefined/etc
  if (typeof data !== 'object' || !data) {
    return false
  }
  // ensure we have something worth styling
  return keys.some(function (key) {
    return data.hasOwnProperty(key)
  })
}

exports.renderError = function (data) {
  var timeOff = String(Math.round((now() - startTime) / 1000) % 10000)
  var line = '[' + padLeft(timeOff, 4, '0') + '] '
  line += chalk['magenta']('(' + data.name + ')') + '\n'
  line += chalk.red(data.err.stack) + '\n'
  return line
}

exports.renderObject = function (data) {
  var timeOff = String(Math.round((now() - startTime) / 1000) % 10000)
  var line = ''
  line += '[' + padLeft(timeOff, 4, '0') + '] '
  line += levels.stringify(data.level)
  line += chalk['magenta']('(' + data.name + ')') + '\n'
  line += destructureMessage(data.message)
  return line
}

exports.create = function (defaultName) {
  return function render (data) {
    var level = data.level
    var name = data.name

    // some default colors
    var defaultColors = {
      level: levels.color(level) || 'yellow',
      name: 'magenta',
      time: 'dim',
      statusCode: data.statusCode >= 400 ? 'red' : 'green',
      contentLength: 'dim',
      elapsed: 'dim',
      url: 'bold',
      method: 'dim',
      type: 'dim'
    }

    // possible user overrides
    var colors = data.colors || {}

    if (typeof data.message === 'object') {
      data.message = destructureMessage(data.message)
    }

    // clean up the messages a little
    if (level) {
      data.level = levels.stringify(level)
    }

    if (name) {
      data.name = name === defaultName ? '' : ('(' + name + ')')
    }

    if (data.url) data.url = stripUrl(data.url)
    if (data.type) data.type = '(' + data.type + ')'

    var line = []
    var timeOff = String(Math.round((now() - startTime) / 1000) % 10000)
    data.time = '[' + padLeft(timeOff, 4, '0') + ']'

    if (!data.message) {
      data.level = level = ''
    }

    var alignLeft = true

    // render each of our valid keys
    keys.forEach(function (key) {
      var value = data[key]

      // skip empty data
      if (!value && typeof value !== 'number') {
        return
      }

      // compact formatting
      if (key === 'elapsed') value = fixElapsed(value)
      if (key === 'contentLength') value = fixSize(value)

      // pad to length
      if (key in paddings) {
        var left = alignLeft || leftAligns.indexOf(key) >= 0
        var padFn = left ? padRight : padLeft
        value = padFn.call(padFn, value, paddings[key], ' ')
        alignLeft = false
      }

      // colorize chunk
      var newColor = getColor(key, colors, defaultColors)

      if (newColor) {
        value = chalk[newColor](value)
      }

      line.push(value)
    })
    return line.join(' ')
  }
}

function fixElapsed (time) {
  if (typeof time === 'string' && /s$/i.test(time)) {
    return time
  }
  if (/infinity/i.test(time)) return time
  var ms = parseInt(time, 10)
  return ms > 9999 ? prettyMs(ms) : (ms + 'ms')
}

function fixSize (size) {
  if (typeof size === 'string' && /s$/i.test(size)) {
    return size
  }
  if (/infinity/i.test(size)) return size
  var bytes = parseInt(size, 10)
  return bytes > 9999
    ? prettyBytes(bytes)
      .replace(/ /, '')
    : (bytes + 'B')
}

function getColor (key, colors, defaultColors) {
  // try to apply user style
  var newColor = colors[key]

  // use default if style is invalid
  if (ansiStyles.indexOf(newColor) === -1) {
    newColor = null
  }
  return newColor || defaultColors[key]
}

// destructure a message onto an object if the message
// is an object.
// obj -> str
function destructureMessage (msg) {
  const keys = Object.keys(msg)
  var res = ''
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var val = msg[key]
    if (i !== 0) res += '\n'
    res += chalk.blue('  "' + key + '"')
    res += ': '
    res += chalk.green('"' + val + '"')
  }
  return res
}
