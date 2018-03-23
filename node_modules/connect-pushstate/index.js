'use strict';

var path = require('path');
var url = require('url');

module.exports = function(options) {
  options = options || {};

  var root = options.root || '/';
  var allow = options.allow ? new RegExp(options.allow) : false;
  var disallow = options.disallow ? new RegExp(options.disallow) : false;

  return function pushState(req, res, next) {
    var pathname = url.parse(req.url).pathname;
    var allowed = allow ? allow.test(pathname) : false;
    var disallowed = disallow ? disallow.test(pathname) : false;
    var hasFileExtension = !!(path.extname(pathname));

    if (allowed || (!disallowed && hasFileExtension)) {
      next();
    } else {
      req.url = root;
      next();
    }
  };
};
