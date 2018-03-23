style-attr
====

Very simple parsing and stringifying of style attributes.

[![Build Status](https://secure.travis-ci.org/joshwnj/style-attr.png)](http://travis-ci.org/joshwnj/style-attr)


`parse`
----

Convert a style attribute string to an object.

- inputs:
  - string (eg. anything you might see in a style attribute)
  - [options](#opts-object) (optional)

- return: object


`stringify`
----

Convert an object into an attribute string

- input: object
- return: string


`normalize`
----

Normalize an attribute string (eg. collapse duplicates)

- inputs:
  - string
  - [options](#opts-object) (optional)

- return: string

Args
----

### `options`

<a name="opts-object"></a>

Options for `parse()` and `normalize` follow the same format:

```
{
  preserveNumbers: boolean // (default: false)
}
```

Setting `preserveNumbers` to `true` recognises number values and converts them to a Number.


License
----

MIT
