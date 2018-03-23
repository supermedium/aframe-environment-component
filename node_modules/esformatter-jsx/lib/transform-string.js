'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// code shameless borrowed from https://github.com/millermedeiros/esformatter-quotes/blob/master/index.js all credit
// to the esformatter-quotes

// Helper to generate a string that repeats itself n times
//   e.g. ("ab", 2) -> "abab"
var repeat = function repeat(str, n) {
  return new Array(n + 1).join(str);
};

var transformString = function transformString(str, opts) {

  if (!opts.type) return str;

  var DOUBLE_QUOTE = '"';
  var SINGLE_QUOTE = '\'';

  var avoidEscape = opts.avoidEscape;
  var quoteValue = opts.type === 'single' ? SINGLE_QUOTE : DOUBLE_QUOTE;
  var alternateQuote = opts.type !== 'single' ? SINGLE_QUOTE : DOUBLE_QUOTE;

  var content = str.substr(1, str.length - 2);
  var quote = quoteValue;
  var alternate = alternateQuote;

  var shouldAvoidEscape = avoidEscape && content.indexOf(quote) >= 0 && content.indexOf(alternate) < 0;

  if (shouldAvoidEscape) {
    alternate = quoteValue;
    quote = alternateQuote;
  }

  // we always normalize the behavior to remove unnecessary escapes
  // If the escaped quote should be unescaped, then escape it (e.g. '\"' -> '"')
  //   However, don't remove escapes from slashes (e.g. '\\"' -> '\\"')
  // DEV: RegExp explained:
  //   - We want to start on a non-slash character to only match at boundaries
  //      (i.e. `^|\`, the 4 slashes are 1 slash in RegExp)
  //   - We want to prevent replacing escaped slashes (i.e. `\\` should not be replaced, this is 8 slashes in RegExp)
  //   - We want to replace `\"` with `"` as the slash is unnecessary
  // /  - We match as many pairs as possible for `\"` due to requiring a leading word boundary on our next match (which won't exist)
  var alternateEscape = new RegExp('(^|[^\\\\])((?:\\\\{2})*)((?:\\\\' + alternate + ')+)', 'g');
  content = content.replace(alternateEscape, function (input, boundaryChar, leadingEscapedSlashes, escapedQuoteChars) {
    return (
      // DEV: We divide the escapedQuoteChars by 2 since there are 2 characters in each escaped part ('\\"'.length === 2)
      boundaryChar + leadingEscapedSlashes + repeat(alternate, escapedQuoteChars.length / 2)
    );
  });

  // If the first character is a quote, escape it (e.g. "'hello" -> '\'hello')
  //   or if a character is an unescaped quote, escape it (e.g. "hello'" -> 'hello\'')
  // If we are an unescaped set of quotes, escape them (e.g. "hello'" -> 'hello\'', "hello''" -> 'hello\'\'')
  // DEV: JavaScript starts the next match at the end of the current one, causing us to need a function or loop.
  var quoteEscape = new RegExp('(^|[^\\\\])((?:\\\\{2})*)(' + quote + '+)', 'g');
  content = content.replace(quoteEscape, function (input, boundaryChar, leadingEscapedSlashes, quoteChars) {
    return boundaryChar + leadingEscapedSlashes + repeat('\\' + quote, quoteChars.length);
  });

  return quote + content + quote;
};

exports.default = transformString;
module.exports = exports['default'];