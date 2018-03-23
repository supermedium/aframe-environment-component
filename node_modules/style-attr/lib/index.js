

/*:: type Attr = { [key: string]: string | number } */
/*:: type Opts = { preserveNumbers: ?boolean } */

/*

style-attr
====

Very simple parsing and stringifying of style attributes.

`parse`
----

Convert a style attribute string to an object.

*/

/*:: declare function parse (raw: string, opts: ?Opts): Attr */
function parse(raw, opts) {
  opts = opts || {};

  var preserveNumbers = opts.preserveNumbers;
  var trim = function (s) {
    return s.trim();
  };
  var obj = {};

  getKeyValueChunks(raw).map(trim).filter(Boolean).forEach(function (item) {
    // split with `.indexOf` rather than `.split` because the value may also contain colons.
    var pos = item.indexOf(':');
    var key = item.substr(0, pos).trim();
    var val = item.substr(pos + 1).trim();
    if (preserveNumbers && isNumeric(val)) {
      val = Number(val);
    }

    obj[key] = val;
  });

  return obj;
}

/*

`isNumeric`
----

Check if a value is numeric.
Via: https://stackoverflow.com/a/1830844/9324

*/

/*:: declare function isNumeric (n: any): boolean */

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*

`getKeyValueChunks`
----

Split a string into chunks matching `<key>: <value>`

*/
/*:: declare function getKeyValueChunks (raw: string): Array<string> */
function getKeyValueChunks(raw) {
  var chunks = [];
  var offset = 0;
  var sep = ';';
  var hasUnclosedUrl = /url\([^\)]+$/;
  var chunk = '';
  var nextSplit;
  while (offset < raw.length) {
    nextSplit = raw.indexOf(sep, offset);
    if (nextSplit === -1) {
      nextSplit = raw.length;
    }

    chunk += raw.substring(offset, nextSplit);

    // data URIs can contain semicolons, so make sure we get the whole thing
    if (hasUnclosedUrl.test(chunk)) {
      chunk += ';';
      offset = nextSplit + 1;
      continue;
    }

    chunks.push(chunk);
    chunk = '';
    offset = nextSplit + 1;
  }

  return chunks;
}

/*

`stringify`
----

Convert an object into an attribute string

*/
/*:: declare function stringify (obj: Attr): string */
function stringify(obj) {
  return Object.keys(obj).map(function (key) {
    return key + ':' + obj[key];
  }).join(';');
}

/*

`normalize`
----

Normalize an attribute string (eg. collapse duplicates)

*/
/*:: declare function normalize (str: string, opts: ?Opts): string */
function normalize(str, opts) {
  return stringify(parse(str, opts));
}

module.exports.parse = parse;
module.exports.stringify = stringify;
module.exports.normalize = normalize;