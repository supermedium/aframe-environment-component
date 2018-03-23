# buffer-to-arraybuffer

Convert Buffer to ArrayBuffer

# Install

```bash
npm install buffer-to-arraybuffer
```

# Usage

```javascript
var BufferToArrayBuffer = require('buffer-to-arraybuffer');

var b = new Buffer(12);
b.write('abc', 0);

var ab = bufferToArrayBuffer(b);
String.fromCharCode(ab[0]) // 'a'
```

# License

MIT
