# quad-indices

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Creates the indices for a quad mesh (two triangles), ideal for sprites, 2D lines, font glyphs, billboards, and other features. 

```js
var createIndices = require('quad-indices')

//basic usage:
var quad = createIndices()
// --> new Uint16Array([0, 1, 2, 0, 2, 3])

//N quads, array type:
var quad = createIndices({ count: 2, type: 'array' })
// --> [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]

//counter-clockwise
var quad = createIndices({ clockwise: false })
// --> new Uint16Array([0, 1, 2, 2, 1, 3])

//store in existing array
var array = new Uint16Array(12)
createIndices(array, { start: 6 })
// --> new Uint16Array([0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 2, 3])
```

## Usage

[![NPM](https://nodei.co/npm/quad-indices.png)](https://www.npmjs.com/package/quad-indices)

#### `quad = createIndices([array], [opt])`

Creates the indices for a quad mesh. Both parameters are optional.

If `array` is provided and is a Buffer or array-like object, it will be used as output instead of creating a new object.

Possible options:

- `count` the number of quads to index, default 1
- `type` (string) the [dtype](https://www.npmjs.com/package/dtype) of the returned array, default '"uint16"'
- `clockwise` (boolean) the orientation of the indices, default true
- `start` the starting index to place the data into the array, default 0

## License

MIT, see [LICENSE.md](http://github.com/Jam3/quad-indices/blob/master/LICENSE.md) for details.
