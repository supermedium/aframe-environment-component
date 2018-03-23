# dtype

Return a data type from a string representing the data type.

Mostly useful for using with [ndarray](https://github.com/mikolalysenko/ndarray)
where you would like instantiate a typed array of the same `array.dtype`.

## example

```js
var dtype = require('dtype')
var ndarray = require('ndarray')

var arr = ndarray(new Int8Array(32))

// some time later

var newarr = ndarray(new (dtype(arr.dtype)))
```

## API
`dtype(string)` will return the following data types based on the strings given:

Data type | String
--------: | :-----
`Int8Array` | "int8"
`Int16Array` | "int16"
`Int32Array` | "int32"
`Uint8Array` | "uint8"
`Uint16Array` | "uint16"
`Uint32Array` | "uint32"
`Float32Array` | "float32"
`Float64Array` | "float64"
`Array` | "array"
`Uint8ClampedArray` | "uint8_clamped"
`ArrayBuffer` | "generic"
`ArrayBuffer` | "data"
`ArrayBuffer` | "dataview"
`Buffer` | "buffer"

> If `Buffer` is not present then `"buffer"` will return `ArrayBuffer`.

## install

With [npm](https://npmjs.org) do:

```
npm install dtype
```

Use [browserify](http://browserify.org) to `require('dtype')`.

## release history
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
