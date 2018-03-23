/*!
 * parse-github-url <https://github.com/jonschlinkert/parse-github-url>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var url = require('url');

var cache = {};

module.exports = function gh(str) {
  return cache[str] || (cache[str] = parse(str));
};

function parse(str) {
  if (typeof str !== 'string' || !str.length) {
    return null;
  }

  if (str.indexOf('git@gist') !== -1 || str.indexOf('//gist') !== -1) {
    return null;
  }

  // parse the URL
  var o = url.parse(str);

  o.path = trimSlash(o.path);
  o.pathname = trimSlash(o.pathname);

  if (o.path.indexOf('repos') === 0) {
    o.path = o.path.substr(6);
  }

  var seg = o.path.split('/').filter(Boolean);
  var hasBlob = seg[2] === 'blob';
  if (hasBlob && !isChecksum(seg[3])) {
    o.branch = seg[3];
  }

  var blob = str.indexOf('blob');
  if (blob !== -1) {
    o.blob = str.substr(blob + 5);
    str = str.substr(0, blob);
  }

  var tree = str.indexOf('tree');
  if (tree !== -1) {
    o.branch = str.substr(tree + 5);
  }

  o.user = user(seg[0]);
  o.repo = repo(seg[1]);

  if (seg.length > 1 && o.user && o.repo) {
    o.repopath = o.user + '/' + o.repo;
  } else {
    var href = o.href.split(':');
    if (href.length === 2 && o.href.indexOf('//') === -1) {
      o.repopath = o.repopath || href[href.length - 1];
      var repoSegments = o.repopath.split('/');
      o.user = repoSegments[0];
      o.repo = repoSegments[1];
    } else {
      var match = o.href.match(/\/([^\/]*)$/);
      o.user = match ? match[1] : null;
      o.repopath = null;
    }

    var segs = o.repopath && o.repopath.split('/').filter(Boolean);
    if (segs && segs.length === 2) {
      o.user = segs[0];
      o.repo = segs[1];
    }
  }

  o.branch = o.branch || seg[2] || parseBranch(o.path, o);
  var res = {};
  res.user = o.user || null;
  res.repo = o.repo || null;
  res.repopath = o.repopath;
  res.branch = o.branch;
  return res;
}

function isChecksum(str) {
  return /^[a-f0-9]{40}$/i.test(str);
}

function parseBranch(str, obj) {
  var branch;
  var segs = str.split('#');
  if (segs.length !== 1) {
    branch = segs[segs.length - 1];
  }
  if (!branch && obj.hash && obj.hash.charAt(0) === '#') {
    branch = obj.hash.substr(1);
  }
  return branch || 'master';
}

function trimSlash(path) {
  if (path.charAt(0) === '/') {
    path = path.slice(1);
  }
  return path;
}

function repo(str) {
  if (!str || !str.length) return null;
  str = str.replace(/^\W+/, '');
  str = str.replace(/\.git$/, '');
  return str;
}

function user(str) {
  if (!str || !str.length) return null;
  if (str.indexOf(':') !== -1) {
    var segs = str.split(':');
    return segs[segs.length - 1];
  }
  return str;
}
