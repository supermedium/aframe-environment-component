[![Build Status](https://travis-ci.org/fgnass/stacked.svg)](https://travis-ci.org/fgnass/stacked)

# stacked

Stacked is a stand-alone, lightweight, zero-dependency version of
[connect](http://www.senchalabs.org/connect/)'s middleware infrastructure.

It can be used to create modules that bundle multiple middleware functions
into one.

### Installation

```
npm install stacked --save
```

### Usage

```javascript
var stacked = require('stacked')

/**
 * A middleware that logs the requested URL.
 */
function middleware(req, res, next) {
  console.log('url:', req.url)
  next()
}

/**
 * A middleware that logs the requested URL (with the mount point stripped)
 * as well as the original URL.
 */
function mounted(req, res, next) {
  console.log('url:', req.url, 'realUrl:', req.realUrl)
  next()
}

module.exports = stacked()
  .use(middleware)
  .mount('/path', mounted)
```

### Run Tests

```
npm install
npm test
```

## The MIT License (MIT)

Copyright (c) 2014 Felix Gnass

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
