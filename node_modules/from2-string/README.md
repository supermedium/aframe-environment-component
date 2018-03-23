# from2-string
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Create a stream from a string. Sugary wrapper around
[from2](https://github.com/hughsk/from2).

## Installation
```bash
$ npm install from2-string
```

## Usage
```js
const fromString = require('from2-string')

fromString('hello world').pipe(process.stdout)
```

## Why
In order to use `from2` with strings, you must write some boilerplate to
break the string in correctly sized chunks. This module handles that
boilerplate for you, so you can directly source from a string.

## See Also
- [from2](https://github.com/hughsk/from2) - Convenience wrapper for ReadableStream, with an API lifted from "from" and "through2"
- [from2-array](https://github.com/binocarlos/from2-array) - Create a from2 stream based on an array of source values

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/from2-string.svg?style=flat-square
[npm-url]: https://npmjs.org/package/from2-string
[travis-image]: https://img.shields.io/travis/yoshuawuyts/from2-string.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/from2-string
[coveralls-image]: https://img.shields.io/coveralls/yoshuawuyts/from2-string.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yoshuawuyts/from2-string?branch=master
[downloads-image]: http://img.shields.io/npm/dm/from2-string.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/from2-string
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
