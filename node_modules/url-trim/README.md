# url-trim

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Trims query and hash parameters off of a URL.

## Install

```sh
npm install url-trim --save
```

## Example

```js
var urlTrim = require('url-trim')

urlTrim('http://localhost:9966/?foo=bar')
//=> 'http://localhost:9966/'

urlTrim('/path/foo?blah#bar')
//=> '/path/foo'
```

## Usage

[![NPM](https://nodei.co/npm/url-trim.png)](https://www.npmjs.com/package/url-trim)

#### `trimmed = trim([url])`

Trims the query string and hash parameters from a URL.

If `url` is empty or not a string, this method returns an empty string.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/url-trim/blob/master/LICENSE.md) for details.
