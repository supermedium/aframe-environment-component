var test = require('tape')
var jsonify = require('../')
var fs = require('fs')
var path = require('path')

test('standard-json', function (t) {
  t.plan(1)
  var data = fs.readFileSync(path.join(__dirname, 'data.txt'), {encoding: 'utf8'})
  var dataJson = [{'filePath': '/someplace/index.js', 'messages': [{'line': '5', 'column': '23', 'message': 'Strings must use singlequote.', 'ruleId': undefined}, {'line': '15', 'column': '36', 'message': 'Extra semicolon.', 'ruleId': undefined}]}]

  var output = jsonify(data)

  t.deepEqual(output, dataJson, 'JSON formatted')
})

test('standard-json verbose', function (t) {
  t.plan(1)
  var data = fs.readFileSync(path.join(__dirname, 'data-verbose.txt'), {encoding: 'utf8'})
  var dataJson = [{'filePath': '/someplace/index.js', 'messages': [{'line': '5', 'column': '23', 'message': 'Strings must use singlequote.', 'ruleId': 'quotes'}, {'line': '15', 'column': '36', 'message': 'Extra semicolon.', 'ruleId': 'semi'}]}]

  var output = jsonify(data)

  t.deepEqual(output, dataJson, 'JSON formatted')
})
