# esformatter-remove-trailing-commas [![Build Status](https://travis-ci.org/kewah/esformatter-remove-trailing-commas.svg?branch=master)](https://travis-ci.org/kewah/esformatter-remove-trailing-commas)

[esformatter](https://github.com/millermedeiros/esformatter) plugin that removes trailing commas.

```js
var foo = {
  a: 1,
};

// converted to:
var foo = {
  a: 1
};
```

## Install

With [npm](http://npmjs.org) do:

```bash
$ npm i esformatter-remove-trailing-commas
```

## Usage

esformatter config file:

```json
{
  "plugins": [
    "esformatter-remove-trailing-commas"
  ]
}
```

## License

MIT
