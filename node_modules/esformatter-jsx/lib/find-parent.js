"use strict";

function matchAny(type, types) {
  types = types || [];
  for (var i = 0, len = types.length; i < len; i++) {
    if (type === types[i]) {
      return true;
    }
  }
  return false;
}

module.exports = function findParent() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var node = args.shift();

  while (node.parent) {
    if (matchAny(node.parent.type, args)) {
      return node.parent;
    }
    node = node.parent;
  }
  return null;
};