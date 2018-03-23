var test = require('tape')
var fmt = require('../../').transform

var noops = []

test.skip('JSX noops', function (t) {
  t.plan(noops.length)
  noops.forEach(function (obj) {
    var fmtd = fmt(obj.program)
    t.equal(fmtd, obj.program, obj.msg)
    console.log('issues:\n' + obj.issues.join('\n'))
  })
})
