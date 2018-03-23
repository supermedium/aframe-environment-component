# bole

**A tiny JSON logger**

[![NPM](https://nodei.co/npm/bole.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/bole/)

Log JSON from within Node.js applications. The log format is obviously inspired by the excellent [Bunyan](https://github.com/trentm/node-bunyan) and is likely to be output-compatible in most cases. The difference is that **bole** aims for even more simplicity, supporting only the common-case basics.

**bole** is designed for global singleton use. Your application has many log sources, but they all aggregate to the same sources. You configure output in *one place* for an application, regardless of how many modules and dependencies are also using **bole** for logging.

## Example

**mymodule.js**
```js
var log = require('bole')('mymodule')

module.exports.derp = function derp() {
  log.debug('W00t!')
  log.info('Starting mymodule#derp()')
}
```

**main.js**
```js
var bole = require('bole')
var mod  = require('./mymodule')

bole.output({
  level: 'info',
  stream: process.stdout
})

mod.derp()
```

```text
$ node main
{"time":"2014-05-18T23:47:06.545Z","hostname":"tweedy","pid":27374,"level":"info","name":"mymodule","message":"Starting mymodule#derp()"}
```

## Features

* Arbitrary log **names**, create a logger by calling `var log = bole('logname')` and `'logname'` will be attached to the output
* Loggers have 4 levels / methods: `log.debug()`, `log.info()`, `log.warn()`, `log.error()`
* Log methods accept `console.log()` style strfmt output ( using`util.format()`): `log.warn('foo %s', 'bar')`
* Log methods accept arbitrary objects that extend the log output data, each property on the object is attached to the debug output object
* Log methods accept `Error` objects and print appropriate `Error` properties, including a full stack trace (including any *cause* where supported)
* Log methods accept `http.IncomingMessage` for simple logging of an HTTP server's `req` object. URL, method, headers, remote host details will be included in the log output.
* Newline separated JSON output to arbitrary streams
* Any number of output streams, each with configurable minimum log-levels
* Fast short-circuit where no loggers are configured for the log-level, effectively making log statements a noop where they don't output
* Sub-logger to split a logger for grouping types of events, such as individual HTTP request
* Object-logging (i.e. not automatically stringified) if you pass an `objectMode:true` stream for output.

## API

### bole(name)

Create a new **logger** with the supplied `name` to be attached to each output. If you keep a logger-per module you don't need to pass loggers around, *keep your concerns separated*.

### logger#debug(), logger#info(), logger#warn(), logger#error()

Loggers have 4 roughly identical log methods, one for each of the supports log-levels. Log levels are recorded on the output and can be used to determine the level of detail passed to the output.

Log methods support the following types of input:

* **`Error` objects**: log output will include the error `name`, `message`, complete `stack` and also a `code` where there is one. Additionally you can supply further arguments which are passed to `util.format()` and attached as a `"message"` property to the output: `log.warn(err, 'error occurred while fetching session for user %s', user.name)`

* **`http.IncomingMessage`** for simple access-log style logging. URL, method, headers, remote address and remote port are logged: `log.info(req)`, further data can be provided for a `"message"` property if required.

* **Arbitrary objects** whose properties will be placed directly on the logged output object. Be careful passing objects with large numbers of properties, in most cases you are best to construct your own objects: `log.debug({ dbHost: 'foo', dbPort: 8080 }, 'connecting to database')`, further data can be provided for a `"message"` property if required.

* **console.log style output** so you can treat loggers just like `console.log()`: `log.info('logging a string')`, `log.info('it has been said that %d is the meaning of %s', 42, 'life')`, `log.debug('foo', 'bar', 'baz')`.

If you require more sophisticated serialisation of your objects, then write a utility function to convert those objects to loggable objects.

### logger()

The `logger` object returned by `bole(name)` is also a function that accepts a `name` argument. It returns a new logger whose name is the parent logger with the new name appended after a `':'` character. This is useful for splitting a logger up for grouping events. Consider the HTTP server case where you may want to group all events from a particular request together:

```js
var log = bole('server')

http.createServer(function (req, res) {
  req.log = log(uuid.v4()) // make a new sub-logger
  req.log.info(req)

  //...

  // log an error against this sub-logger
  req.log.error(err)
})
```

In this case, your events would be listed as something like `"name":"server:93f57a1a-ae59-46da-a625-8d084a77028a"` and each event for a particular request would have the same `"name"` property, distinct from the rest.

Sub-loggers can even be split in to sub-sub loggers, the rabbit hole is ~bottomless.

### bole.output()

Add outputs for application-wide logging, accepts either an object for defining a single output or an array of objects defining multiple outputs. Each output requires only a `'level'` and a `'stream'`, where the *level* defines the *minimum* debug level to print to this stream and the *stream* is any `WritableStream` that accepts a `.write()` method.

If you pass in a stream with `objectMode` set to `true` then you will receive the raw log objects rather than their stringified versions.

```js
bole.output([
  { level: 'debug', fs.createWriteStream('app.log') },
  { level: 'info', process.stdout }
])
```

### bole.reset()

Clears all output streams from the application

## Additional features

If you need to serialise specific types of objects then **write a utility function** to convert to a loggable object.

If you need a special kind of output then **write a stream to accept output data**.

If you need to filter a present output data in a special way, **write a package to do it and publish it in npm**.

## License

**bole** is Copyright (c) 2014 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT License. All rights not explicitly granted in the MIT License are reserved. See the included [LICENSE.md](./LICENSE.md) file for more details.
