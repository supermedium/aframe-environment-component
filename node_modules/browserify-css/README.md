# browserify-css [![build status](https://travis-ci.org/cheton/browserify-css.svg?branch=master)](https://travis-ci.org/cheton/browserify-css) [![Coverage Status](https://coveralls.io/repos/cheton/browserify-css/badge.svg?branch=master&service=github)](https://coveralls.io/github/cheton/browserify-css?branch=master)

[![NPM](https://nodei.co/npm/browserify-css.png?downloads=true&stars=true)](https://nodei.co/npm/browserify-css/)

A Browserify transform for bundling, rebasing, inlining, and minifying CSS files. It's useful for CSS modularization where styles are scoped to their related bundles.

## Getting Started

If you're new to browserify, check out the [browserify handbook](https://github.com/substack/browserify-handbook) and the resources on [browserify.org](http://browserify.org/).

## Installation

`npm install --save-dev browserify-css`

## Usage

app.css:
``` css
@import url("modules/foo/index.css");
@import url("modules/bar/index.css");
body {
    background-color: #fff;
}
```

app.js:
``` js
var css = require('./app.css');
console.log(css);
```

You can compile your app by passing -t browserify-css to browserify:
``` bash
$ browserify -t browserify-css app.js > bundle.js
```

Each `require('./path/to/file.css')` call will concatenate CSS files with @import statements, rebasing urls, inlining @import, and minifying CSS. It will add a style tag with an optional data-href attribute to the head section of the document during runtime:

``` html
<html>
<head>
    <style type="text/css" data-href="app.css">...</style>
</head>
</html>
```

## Configuration

You can set configuration to your package.json file:
``` json
{
    "browserify-css": {
        "autoInject": true,
        "minify": true,
        "rootDir": "."
    }
}
```

or use an external configuration file like below:
``` json
{
    "browserify-css": "./config/browserify-css.js"
}
```

config/browserify-css.js:
``` js
module.exports = {
    "autoInject": true,
    "minify": true,
    "rootDir": "."
};
```

Furthermore, browserify-css transform can obtain options from the command-line with subarg syntax:
```
$ browserify -t [ browserify-css --autoInject=true ] app.js
```
or from the api:
```
b.transform('browserify-css', { autoInject: true })
```

## Options

### autoInject

Type: `Boolean`
Default: `true`

If true, each `require('path/to/file.css')` call will add a style tag to the head section of the document.

### autoInjectOptions

Type: `Object`
Default: 
``` json
{
    "verbose": true
}
```

If verbose is set to true, the path to CSS will be specified in the data-href attribute inside the style tag

### minify

Type: `Boolean`
Default: `false`

### minifyOptions

Type: `Object`
Default: `{}`

Check out a list of CSS minify options at [CleanCSS](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically).

### processRelativeUrl

Type: `Function`

The `processRelativeUrl` option accepts a function which takes one argument (the relative url) and returns the original `relativeUrl` string or the converted result. For example:
``` javascript
var browserify = require('browserify');

browserify(options)
    .add('src/index.js')
    .transform(require('browserify-css'), {
        rootDir: 'src',
        processRelativeUrl: function(relativeUrl) {
            return relativeUrl;
        }
    })
    .bundle();
```

You can embed the image data directly into the CSS file with data URI, like so:
``` javascript
var _ = require('lodash');
var path = require('path');
var browserify = require('browserify');

browserify(options)
    .add('src/index.js')
    .transform(require('browserify-css'), {
        rootDir: 'src',
        processRelativeUrl: function(relativeUrl) {
            if (_.contains(['.jpg','.png','.gif'], path.extname(relativeUrl))) {
                // Embed image data with data URI
                var DataUri = require('datauri');
                var dUri = new DataUri(relativeUrl);
                return dUri.content;
            }
            return relativeUrl;
        }
    })
    .bundle();
```

You may also want to check out the  [FAQ](https://github.com/cheton/browserify-css#2-how-do-i-load-font-and-image-files-from-node_modules) for advanced usage.

### rebaseUrls

Type: `Boolean`
Default: `true`

If true, relative paths will be rebased in css files; if false, paths will be unchanged.

### rootDir

Type: `String`
Default: `./`

An absolute path to resolve relative paths against the project's base directory.


## FAQ 
### 1. How do I include CSS files located inside the node_modules folder?
You can choose one of the following methods to include CSS files located inside the node_modules folder:

1. The easiest way to do this is using the `@import` rule. For example:

  app.js:
  ``` javascript
  require('./app.css');
  ```

  app.css:
  ``` css
  /* Use CSS from your node_modules folder */
  @import "node_modules/foo/foo.css";

  /* Or your own relative files */
  @import "styles/common.css";
  ```
  
2. Use the global transform option (i.e. `--global-transform` or `-g`) on the command line to transform all files in a node_modules directory:

  ``` bash
  $ browserify -g browserify-css app.js > bundle.js 
  ```

  or use the API directly:

  ``` javascript
  var browserify = require('browserify');
  var b = browserify('./app.js');
  b.transform('browserify-css', {global: true});
  b.bundle().pipe(process.stdout);
  ```
  See [browserify transform options](https://github.com/substack/node-browserify#btransformtr-opts) for details.

3. Put browserify transform option into a submodule's package.json file inside the `node_modules` directory on a **per-module basis** like so:

  node_modules/foo/package.json:
  ``` json
  {
    "browserify": {
      "transform": ["browserify-css"]
    }
  }
  ```

  Then, run browserify transform on the command line:
  ``` bash
  $ browserify -t browserify-css app.js > bundle.js 
  ```

### 2. How do I load font and image files from node_modules?

Assume that you have the following directory structure:
``` bash
package.json
dist/
src/
    index.js
    index.css
node_modules/
    bootstrap/
        dist/
            css/
                bootstrap.css
```

The `index.css` uses `@import` to import external style sheets:
``` css
@import url("../node_modules/bootstrap/dist/css/bootstrap.css");
```

All output files, including the generated `bundle.js`, are created under the `dist` directory:
``` bash
dist/
    bundle.js
    vendor/
        bootstrap/
            dist/
                css/
                    bootstrap.css
```

Suppose that the `dist` directory is your web root, you might want to copy external font and images files from `../node_modules/` to `dist/vendor/`.

For example, the `@font-face` rules in `node_modules/bootstrap/dist/css/bootstrap.css`:
``` css
@font-face {
    font-family: 'Glyphicons Halflings';
    src: url('../fonts/glyphicons-halflings-regular.eot');
    src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'),
         url('../fonts/glyphicons-halflings-regular.woff2') format('woff2'),
         url('../fonts/glyphicons-halflings-regular.woff') format('woff'),
         url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'),
         url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg');
}
```

The example below illustrates the use of the `processRelativeUrl` option:
``` javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var browserify = require('browserify');
var sourceStream = require('vinyl-source-stream');
var fse = require('fs-extra');

var bundleStream = browserify()
    .add('src/index.js')
    .transform(require('browserify-css'), {
        rootDir: 'src',
        processRelativeUrl: function(relativeUrl) {
            var stripQueryStringAndHashFromPath = function(url) {
                return url.split('?')[0].split('#')[0];
            };
            var rootDir = path.resolve(process.cwd(), 'src');
            var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
            var queryStringAndHash = relativeUrl.substring(relativePath.length);

            //
            // Copying files from '../node_modules/bootstrap/' to 'dist/vendor/bootstrap/'
            //
            var prefix = '../node_modules/';
            if (_.startsWith(relativePath, prefix)) {
                var vendorPath = 'vendor/' + relativePath.substring(prefix.length);
                var source = path.join(rootDir, relativePath);
                var target = path.join(rootDir, vendorPath);

                gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
                fse.copySync(source, target);

                // Returns a new path string with original query string and hash fragments
                return vendorPath + queryStringAndHash;
            }

            return relativeUrl;
        }
    })
    .bundle();

bundleStream
    .pipe(sourceStream(bundleFile))
    .pipe(gulp.dest(browserifyConfig.dest));

```


## License

Copyright (c) 2014-2015 Cheton Wu

Licensed under the [MIT License](https://github.com/cheton/browserify-css/blob/master/LICENSE).
