# connect-pushstate

Connect middleware that rewrites select requests to the site root, allowing your client-side pushstate router to handle them.

Requests including a file extension are left untouched so site assets like your images, stylesheets, and JavaScripts will load unaffected, while requests without a file extension, presumably pages or actions within your site, are rewritten to point at the root, with the original URL intact.

You can also specify regular expressions to specifically allow or disallow additional paths from being affected.

This functionality is commonly needed by single page web-apps.

## Getting Started

Install package

```shell
npm install connect-pushstate --save
```

Load the middleware by adding the following line of JavaScript.

```js
var pushState = require('connect-pushstate');
```

Add the `pushState` middleware call to your server definition, amongst your other middleware.

##### Options

The pushState method accepts an options object as an optional parameter with the following properties.

* __root__ - The location where requests will be rerouted to.  Defaults to '/'. e.g. `pushState({ root: '/foo' })`
* __allow__ - A pattern that will allow requests matching it to pass through without being redirected.  e.g. `pushState({ allow: '^/api' })`  You might need this option if your client app and API are on the same server.
* __disallow__ - A pattern that will disallow requests matching it to pass through without being redirected.  e.g. `pushState({ disallow: '^/version/1.2.3' })`

```js
'use strict';

var connect = require('connect');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var pushState = require('connect-pushstate');
var port = process.env.PORT || 3000;

var app = connect()
.use(pushState())
.use(serveStatic('www/'))
.use(morgan('dev'))
.listen(port, function() {
	console.log('Application server stated on port', port);
});
```
_Note that [serve-static](https://www.npmjs.com/package/serve-static) is needed in order to actually serve your files._

## Examples

For a quick demo, see the examples directory, or run the test suite.

```shell
cd examples
node server.js
```

## Tests

Execute the test suite
```
npm test
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
- 1.1.0 Add "disallow" option.  Add grunt package to devDependencies.
- 1.0.0 Introduce options object. Add "allow" option. Simplify directory structure. Update dependencies. Other minor housekeeping.
- 0.1.0 Initial release
