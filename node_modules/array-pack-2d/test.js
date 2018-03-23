var test = require('tape')
var pack = require('./')

test('simple 2x3 array', function(t) {
  t.plan(1)
  t.deepEqual(pack([
    [1, 2, 3],
    [4, 5, 6]
  ]), new Float32Array([1, 2, 3, 4, 5, 6]))
})

test('simple 3x2 array', function(t) {
  t.plan(1)
  t.deepEqual(pack([
    [1, 2],
    [3, 4],
    [5, 6]
  ]), new Float32Array([1, 2, 3, 4, 5, 6]))
})

test('sub-arrays of multiple lengths', function(t) {
  t.plan(1)
  t.deepEqual(pack([
    [1, 2],
    [3, 4, 9],
    [5, 6]
  ]), new Float32Array([1, 2, 3, 4, 5, 6])
    , 'sub-arrays of different lengths are not permitted'
  )
})

test('custom array types', function(t) {
  t.plan(3)

  t.deepEqual(pack([
    [1, 2],
    [3, 4],
    [5, 6]
  ], 'uint16'), new Uint16Array([1, 2, 3, 4, 5, 6])
   , 'can be specified as a dtype string')

  t.deepEqual(pack([
    [1, 2],
    [3, 4],
    [5, 6]
  ], Uint16Array), new Uint16Array([1, 2, 3, 4, 5, 6])
   , 'can pass in constructor directly')

  t.deepEqual(pack([
    [1, 2],
    [3, 4],
    [5, 6]
  ], Array)
   , [1, 2, 3, 4, 5, 6]
   , 'also works with Array')
})

test('returns the original array if already unpacked', function(t) {
  t.plan(2)

  var original = [
    1, 2, 3, 4, 5
  ]

  t.deepEqual(pack(original), original)
  t.equal(pack(original), original)
})
