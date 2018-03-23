var semi = require('semi')
var transform = require('standard-format').transform
module.exports.transform = function (text) {
  text = transform(text)
  // handle errors
  semi.on('error', function (err) { throw err })

  return semi.add(text)
}
