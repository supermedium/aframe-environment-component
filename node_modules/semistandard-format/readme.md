
# semistandard-format
  This is a fork of [standard-format](https://github.com/maxogden/standard-format) same concept but with semicolons.

## Installation

  Install with npm

    $ npm install -g semistandard-format

## Example Usage

  Output all formatted javascript in a directory and subdirectories to stdout

    $ semistandard-format

  Format all javascript files, overwriting them into standard format

    $ semistandard-format -w

  Format javascript over stdin

    $ semistandard-format < file.js > formatted-file.js

  Format and overwrite specific files

    $ semistandard-format -w file1.js file2.js

### Editor plugins

 - Sublime Text: [sublime-standard-format](https://packagecontrol.io/packages/StandardFormat)
 - Atom: [atom-standard-formatter](https://atom.io/packages/standard-formatter)

### Science :mortar_board:

  > A new step should be added to the modification cycle: modifying the program to make it readable.

  [Elshoff & Marcotty, 1982](http://dl.acm.org/citation.cfm?id=358596)