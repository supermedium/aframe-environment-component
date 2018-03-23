# garnish

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Prettifies [ndjson](http://ndjson.org/) or [bole](https://github.com/rvagg/bole) logs from [budo](https://github.com/mattdesl/budo), [wzrd](https://github.com/maxogden/wzrd/) and other tools. 

Example with [budo](https://github.com/mattdesl/budo), which uses this under the hood.

<img src="http://i.imgur.com/Pvus8vy.png" width="75%" />

## Install

```sh
npm install garnish [-g|--save-dev]
```

## Usage

### CLI

Pipe a ndjson emitter into `garnish` like so:

```sh
node app.js | garnish [opts]

Options:

    --level, -l    the minimum debug level, default 'debug'
    --name, -n     the default app name
```

Where `level` can be `debug`, `info`, `warn`, `error`.

### API

#### `garnish([opt])`

Returns a duplexer that parses input as ndjson, and writes a pretty-printed result. Options:

- `level` (String)
  - the minimum log level to print (default `'debug'`)
  - the order is as follows: `debug`, `info`, `warn`, `error`
- `name` (String)
  - the default name for your logger; a message's `name` field will not be printed when it matches this default name, to reduce redundant/obvious information in the logs.

## format

Typically, you would use [bole](https://github.com/rvagg/bole) or [ndjson](https://www.npmjs.com/package/ndjson) to write the content to garnish. You can also write ndjson to `stdout` like so:

```js
// a log message
console.log({
  name: 'myApp',
  level: 'warn',
  message: 'not found'
})

// a typical server message
console.log({
  name: 'myApp',
  type: 'generated',
  level: 'info',
  url: '/foo.png',
  statusCode: 200,
  contentLength: 12800, // in bytes
  elapsed: 120 // in milliseconds
})
```


Currently garnish styles the following:

- `level`
  - the log level e.g. `debug`, `info`, `warn`, `error` (default `debug`) - only shown if `message` is present
- `name`
  - an optional event or application name. It's recommended to always have a name.
- `message`
  - an event message.
- `url`
  - a url (stripped to pathname), useful for router logging.
- `statusCode`
  - an HTTP statusCode. Codes `>=400` are displayed in red.
- `contentLength`
  - the response size; if a `number`, bytes are assumed
- `elapsed`
  - time elapsed since the previous related event; if a `number`, milliseconds are assumed
- `type`
  - the type of event logged
- `colors`
  - an optional color mapping for custom styles

You can use the `colors` field to override any of the default colors with a new [ANSI style](https://github.com/chalk/ansi-styles).

For example, the following will print `elapsed` in yellow if it passes our threshold:

```js
function logTime (msg) {
  var now = Date.now()
  var time = now - lastTime
  lastTime = now

  console.log({
    name: 'app',
    message: msg,
    elapsed: time + ' ms',
    colors: {
      elapsed: time > 1000 ? 'yellow' : 'green'
    }
  })
}
```

## See Also

- [bistre](https://github.com/hughsk/bistre)

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for details.
