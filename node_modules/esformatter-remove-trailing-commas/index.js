'use strict';

var tk = require('rocambole-token');

exports.tokenBefore = tokenBefore;
function tokenBefore(token) {
  if (isClosingCurlyBracket(token) || isClosingBracket(token)) {
    findTrailingCommas(token.prev);
  }
}

function findTrailingCommas(token) {
  if (!token) return;

  if (tk.isBr(token) || tk.isWs(token)) {
    findTrailingCommas(token.prev);
    return;
  }

  if (tk.isComma(token)) {
    tk.remove(token);
  }
}

function isClosingCurlyBracket(token) {
  return token && token.type === 'Punctuator' && token.value === '}';
}

function isClosingBracket(token) {
  return token && token.type === 'Punctuator' && token.value === ']';
}
