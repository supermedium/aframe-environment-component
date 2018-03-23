# standard-format

  [![Build Status](https://travis-ci.org/maxogden/standard-format.svg)](https://travis-ci.org/maxogden/standard-format)
  [![Dependency Status](https://david-dm.org/maxogden/standard-format.svg?style=flat-square)](https://david-dm.org/maxogden/standard-format)

  **experimental** auto formatter for the easier cases in [standard](https://www.npmjs.com/package/standard)

# DEPRECATED

### Use `standard --fix` instead of `standard-format`.

This package is no longer maintained.

`standard` v8.0.0 contains a new `--fix` command line flag to automatically fix
problems. If you need ES2015+ support, consider using `standard --fix` instead
of `standard-format` (this package) which may mangle your ES2015+ code.

`standard --fix` is built into `standard` v8.0.0 for maximum convenience, it
supports ES2015, and it's lightweight (no additional dependencies since it's part
of ESLint which powers `standard`). Lots of problems are already fixable, and more
are getting added with each ESLint release.

`standard` also outputs a message ("Run `standard --fix` to automatically fix
some problems.") when it detects problems that can be fixed automatically so you
can save time!

## Installation

  Install with npm

    $ npm install -g standard-format

## Example Usage

  Output all formatted javascript in a directory and subdirectories to stdout

    $ standard-format

  Format all javascript files, overwriting them into standard format

    $ standard-format -w

  Format javascript over stdin

    $ standard-format < file.js > formatted-file.js

  Format and overwrite specific files

    $ standard-format -w file1.js file2.js

### Development tasks for task runners

- Gulp
    - [gulp-standard-format](https://github.com/Andruj/gulp-standard-format/)
    - [gulp-standard-bundle](https://github.com/ggarciao/gulp-standard-bundle)
- Grunt [grunt-standard](https://github.com/pdehaan/grunt-standard)

### Editor plugins

  - Sublime Text: [sublime-standard-format](https://packagecontrol.io/packages/StandardFormat)
  - Atom: [atom-standard-formatter](https://atom.io/packages/standard-formatter)

### Science :mortar_board:

  > A new step should be added to the modification cycle: modifying the program to make it readable.

  [Elshoff & Marcotty, 1982](http://dl.acm.org/citation.cfm?id=358596)
