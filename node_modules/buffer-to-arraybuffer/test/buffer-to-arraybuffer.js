var test = require('tape');
var bufferToArrayBuffer = require('../buffer-to-arraybuffer');

function bufferEqual(a, b) {
  for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
  }
  return true;
}

test('bufferToArrayBuffer', function (t) {
  t.plan(2);

  var str = 'abc';

  var b = new Buffer(12);
  b.write(str, 0);

  var ab = new ArrayBuffer(12);
  var v = new DataView(ab);
  [].slice.call(str).forEach(function(s, i) {
    v[i] = s.charCodeAt(0);
  });

  var cab = bufferToArrayBuffer(b);

  t.strictEqual(bufferEqual(cab, ab), true);
  t.equal(String.fromCharCode(cab[0]), 'a');
});
