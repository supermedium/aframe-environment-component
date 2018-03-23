# simple-html-index

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A tiny through stream that returns a bare-bones HTML5 template with an optional
`<link>` and `<title>` in the head and `<script>` entry-point in the body.

## Example

In `html.js`

```js
var html = require('simple-html-index')

html({ title: 'hello', entry: 'bundle.js' })
  .pipe(process.stdout)
```

Now run `node html.js > index.html` and you would end up with a file that looks like this: (after formatting)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>hello</title>
  <meta charset="utf-8">
</head>
<body>
  <script src="bundle.js"></script>
</body>
</html>
```

## Usage

[![NPM](https://nodei.co/npm/simple-html-index.png)](https://www.npmjs.com/package/simple-html-index)

#### `stream = html([opt])`

Returns a read stream that writes a bare-bones HTML template, with the
following optional features:

- `title` whether to include a `<title>` element
- `entry` if specified, will add a `<script src={{entry}}>` element
- `css` if specified will add a `<link rel="stylesheet" href={{css}}>` element
- `favicon` if `true` the `favicon.ico` request [will be suppressed][1]
- `lang` the value of the `lang` attribute in the root `<html>` element, default `'en'`
- `base` if specified will add a `<base href={{base}}>` element

## Additional properties
Combine `simple-html-index` with
[`hyperstream`](https://github.com/substack/hyperstream) to add additional
properties to html. An example how to add an extra `<script>` tag to the body
tag:
```js
const hyperstream = require('hyperstream')
const html = require('simple-html-index')

const htmls = html({ entry: 'static/bundle.js' })
const hs = hyperstream({
  body: { _appendHtml: "<script>console.log('extra tags!')</script>" }
})

htmls.pipe(hs).pipe(process.stdout)
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/simple-html-index/blob/master/LICENSE.md) for details.

[1]: http://stackoverflow.com/a/5568484/1541707
