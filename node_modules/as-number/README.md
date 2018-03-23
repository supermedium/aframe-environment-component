# as-number

[![frozen](http://badges.github.io/stability-badges/dist/frozen.svg)](http://github.com/badges/stability-badges)

Tiny function that returns the given number, or a default value if `typeof !== 'number'`. If no default is given, returns 0.

```js
var number = require('as-number')

var num = number(arg0, 25) //default to 25
var num2 = number(arg1)    //default to zero
```

## Usage

[![NPM](https://nodei.co/npm/as-number.png)](https://nodei.co/npm/as-number/)

#### `number(value[, default])`

If `value` is `typeof === 'number'`, then it simply returns `value` unchanged. Otherwise, it will return `default` if it is also a number, or zero. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/as-number/blob/master/LICENSE.md) for details.
