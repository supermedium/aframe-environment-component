const assert = require('assert')
const from = require('from2')

module.exports = fromString

// create a stream from a string
// str -> stream
function fromString (string) {
  assert.equal(typeof string, 'string')

  return from(function (size, next) {
    if (string.length <= 0) return this.push(null)

    const chunk = string.slice(0, size)
    string = string.slice(size)

    next(null, chunk)
  })
}
