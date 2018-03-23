#!/usr/bin/env node

module.exports = Cli

var defaults = require('defaults')
var minimist = require('minimist')
var multiline = require('multiline')
var getStdin = require('get-stdin')
var fs = require('fs')

function Cli (opts) {
  var standard = require('../').linter(opts)

  opts = defaults(opts, {
    cmd: 'standard-engine',
    tagline: 'JavaScript Custom Style',
    version: require('../package.json').version
  })

  var argv = minimist(process.argv.slice(2), {
    alias: {
      format: 'F',
      global: 'globals',
      plugin: 'plugins',
      env: 'envs',
      help: 'h',
      verbose: 'v'
    },
    boolean: [
      'fix',
      'format',
      'help',
      'stdin',
      'verbose',
      'version'
    ],
    string: [
      'global',
      'plugin',
      'parser',
      'env'
    ]
  })

  if (argv.format) {
    if (typeof opts.formatter === 'string') {
      console.error(opts.cmd + ': ' + opts.formatter)
      exit(1)
      return
    }
    if (typeof opts.formatter !== 'object' ||
        typeof opts.formatter.transform !== 'function') {
      console.error(opts.cmd + ': Invalid formatter API')
      exit(0)
      return
    }
  }

  // flag `-` is equivalent to `--stdin`
  if (argv._[0] === '-') {
    argv.stdin = true
    argv._.shift()
  }

  if (argv.help) {
    var fmtMsg = ''
    if (opts.formatter && typeof opts.formatter.transform === 'function') {
      fmtMsg = '\n    -F, --format    Automatically format code.'
      if (opts.formatterName) fmtMsg += ' (using ' + opts.formatterName + ')'
    }
    if (opts.tagline) console.log('%s - %s (%s)', opts.cmd, opts.tagline, opts.homepage)
    console.log(multiline.stripIndent(function () {
      /*

        Usage:
            %s <flags> [FILES...]

            If FILES is omitted, then all JavaScript source files (*.js, *.jsx) in the current
            working directory are checked, recursively.

            Certain paths (node_modules/, .git/, coverage/, *.min.js, bundle.js, vendor/) are
            automatically ignored.

        Flags:%s
            -v, --verbose   Show rule names for errors (to ignore specific rules)
                --fix       Automatically fix problems
                --stdin     Read file text from stdin
                --version   Show current version
            -h, --help      Show usage information

        Flags (advanced):
                --global    Declare global variable
                --plugin    Use custom eslint plugin
                --env       Use custom eslint environment
                --parser    Use custom js parser (e.g. babel-eslint)
      */
    }), opts.cmd, fmtMsg)
    exit(0)
    return
  }

  if (argv.version) {
    console.log(opts.version)
    exit(0)
    return
  }

  var lintOpts = {
    fix: argv.fix,
    globals: argv.global,
    plugins: argv.plugin,
    envs: argv.env,
    parser: argv.parser
  }

  if (argv.stdin) {
    getStdin().then(function (text) {
      if (argv.format) {
        text = opts.formatter.transform(text)
        process.stdout.write(text)
      }
      standard.lintText(text, lintOpts, onResult)
    })
  } else {
    if (argv.format) {
      lintOpts._onFiles = function (files) {
        files.forEach(function (file) {
          var data = fs.readFileSync(file).toString()
          fs.writeFileSync(file, opts.formatter.transform(data))
        })
      }
    }
    standard.lintFiles(argv._, lintOpts, onResult)
  }

  function onResult (err, result) {
    if (err) return onError(err)

    if (argv.fix && !argv.stdin) {
      opts.eslint.CLIEngine.outputFixes(result)
    }

    if (!result.errorCount && !result.warningCount) {
      exit(0)
      return
    }

    console.error(
      '%s: %s (%s) %s',
      opts.cmd,
      opts.tagline,
      opts.homepage,
      'Try `' + opts.cmd + ' --fix` to automatically fix problems.'
    )

    result.results.forEach(function (result) {
      result.messages.forEach(function (message) {
        log(
          '  %s:%d:%d: %s%s',
          result.filePath, message.line || 0, message.column || 0, message.message,
          argv.verbose ? ' (' + message.ruleId + ')' : ''
        )
      })
    })

    exit(result.errorCount ? 1 : 0)
    return
  }

  function onError (err) {
    console.error(opts.cmd + ': Unexpected linter output:\n')
    console.error(err.stack || err.message || err)
    console.error(
      '\nIf you think this is a bug in `%s`, open an issue: %s',
      opts.cmd, opts.bugs
    )
    exit(1)
    return
  }

  /**
   * Print lint errors to stdout since this is expected output from `standard-engine`.
   * Note: When formatting code from stdin (`standard --stdin --format`), the transformed
   * code is printed to stdout, so print lint errors to stderr in this case.
   */
  function log () {
    if (argv.stdin && argv.format) {
      arguments[0] = opts.cmd + ': ' + arguments[0]
      console.error.apply(console, arguments)
    } else {
      console.log.apply(console, arguments)
    }
  }
}

function exit (code) {
  if (/^v0.10./.test(process.version)) {
    // Node v0.10.x lacks support for `process.exitCode`
    process.exit(code)
  } else {
    // Node v6.x will truncate stdout if process.exit(code) is called, so we set
    // process.exitCode and wait for Node to quit when there's nothing left in
    // the event loop
    process.exitCode = code
  }
}
