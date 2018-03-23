var test = require('tape')
var exec = require('child_process').exec
var path = require('path')

var binfile = path.resolve(__dirname, '..', 'bin.js')
var catfile = path.resolve(__dirname, 'data-verbose.txt')

test('return error code 1 if data passed in', function (t) {
  var cmd = 'cat ' + catfile + ' | node ' + binfile
  exec(cmd, function (err, stdout, stderr) {
    t.ok(stdout.length > 0, 'stdout is correct')
    t.equals(err.code, 1, 'correctly exits with code 1')
    t.end()
  })
})

test('return error code 0 if no data passed in', function (t) {
  var cmd = 'echo "" | node ' + binfile
  exec(cmd, function (err, stdout, stderr) {
    t.equals(stdout, '[]\n', 'stdout is correct')
    t.error(err, 'correctly exits without error')
    t.end()
  })
})
