# array-pack-2d [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Quickly pack a nested 2D array into a typed array – useful for flattening point data into a WebGL-friendly format.

## Usage ##

[![array-pack-2d](https://nodei.co/npm/array-pack-2d.png?mini=true)](https://nodei.co/npm/array-pack-2d)

### packed = pack(array, [type]) ###

Takes a nested 2D `array` and packs it into a flat, `packed` one. By default
this will be a `Float32Array`, but you can specify a custom `type` too: this
can be a constructor such as `Uint8Array`, or a
[dtype](http://github.com/shama/dtype) string such as `"float32"` or `"uint8"`.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/array-pack-2d/blob/master/LICENSE.md) for details.
