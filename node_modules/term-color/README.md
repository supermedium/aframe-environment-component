# term-color

<!--
    [![build status][build-png]][build]
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

A lighter weight alternative to chalk

## Example

```js
var TermColor = require("term-color");

console.log(TermColor.red('foo'))
```

## Motivation

```sh
raynos at raynos-SVS15127PXB  ~/projects/chalk on master
$ npm ls --prod
chalk@1.0.0 /home/raynos/projects/chalk
├── ansi-styles@2.0.1
├── escape-string-regexp@1.0.3
├─┬ has-ansi@1.0.3
│ ├── ansi-regex@1.1.1
│ └── get-stdin@4.0.1
├─┬ strip-ansi@2.0.1
│ └── ansi-regex@1.1.1
└── supports-color@1.3.1
```

```sh
raynos at raynos-SVS15127PXB  ~/projects/term-color on master
$ npm ls --prod
term-color@1.0.0 /home/raynos/projects/term-color
├── ansi-styles@2.0.1
└── supports-color@1.3.1
```

`term-color` adds colors to your library but only costs 3
dependencies instead of costing 9 dependencies.

## Supported formats

```js
TermColor.black('text');
TermColor.red('text');
TermColor.green('text');
TermColor.yellow('text');
TermColor.blue('text');
TermColor.magenta('text');
TermColor.cyan('text');
TermColor.white('text');
TermColor.gray('text');
TermColor.bgBlack('text');
TermColor.bgRed('text');
TermColor.bgGreen('text');
TermColor.bgYellow('text');
TermColor.bgBlue('text');
TermColor.bgMagenta('text');
TermColor.bgCyan('text');
TermColor.bgWhite('text');
TermColor.reset('text');
TermColor.bold('text');
TermColor.dim('text');
TermColor.italic('text');
TermColor.underline('text');
TermColor.inverse('text');
TermColor.hidden('text');
TermColor.strikethrough('text');
```

## Installation

`npm install term-color`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licensed

  [build-png]: https://secure.travis-ci.org/Raynos/term-color.png
  [build]: https://travis-ci.org/Raynos/term-color
  [cover-png]: https://coveralls.io/repos/Raynos/term-color/badge.png
  [cover]: https://coveralls.io/r/Raynos/term-color
  [dep-png]: https://david-dm.org/Raynos/term-color.png
  [dep]: https://david-dm.org/Raynos/term-color
  [npm-png]: https://nodei.co/npm/term-color.png?stars&downloads
  [npm]: https://nodei.co/npm/term-color
