var dtype = require('dtype')

module.exports = pack

function pack(arr, type) {
  type = type || 'float32'

  if (!arr[0] || !arr[0].length) {
    return arr
  }

  var Arr = typeof type === 'string'
    ? dtype(type)
    : type

  var dim = arr[0].length
  var out = new Arr(arr.length * dim)
  var k = 0

  for (var i = 0; i < arr.length; i++)
  for (var j = 0; j < dim; j++) {
    out[k++] = arr[i][j]
  }

  return out
}
