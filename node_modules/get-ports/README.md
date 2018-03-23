# get-ports

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Finds multiple open ports after your specified base ports, and below the max range. 

Unlike [getport](https://github.com/mikeal/getport) or [get-port](https://github.com/sindresorhus/get-port), this is useful for situations where you need multiple servers to run on open ports.

If not all ports could be found, the error callback is triggered.

## Install

```sh
npm install get-ports --save
```

## Example

The resulting `ports` array is parallel to your input (base) ports.

For example, if port `8000` and `9966` are already in use:

```js
var getPorts = require('get-ports')

getPorts([ 8000, 9966 ], function (err, ports) {
  if (err) throw new Error('could not open servers')
  
  console.log(ports)
  //=> [ 8001, 9967 ]
})
```

## Usage

[![NPM](https://nodei.co/npm/get-ports.png)](https://www.npmjs.com/package/get-ports)

#### `getPorts(basePorts, [maxPort], callback)`

For the given array of `basePorts`, tries to find the next available port from each one. This keeps track of available ports to ensure there are no conflicts in the final result.

If the finite number `maxPort` is specified, the portfinding will fail when it reaches that maximum port. Defaults to 60000.

The callback is called with `(err, ports)`, where `err` will be an Error if any of the portfindings failed (i.e. no open ports within range). If successful, `err` will be null and `ports` will be an array, parallel to `basePorts`, with the found port numbers.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/get-ports/blob/master/LICENSE.md) for details.
