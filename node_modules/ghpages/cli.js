#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

var launch = require('opn');
var meow = require('meow');
var objectAssign = require('object-assign');

var ghpages = require('./');

var usage = fs.readFileSync(path.join(__dirname, 'usage.txt')).toString();

var cli = meow(usage, {
  help: usage,
  alias: {
    r: 'repo',
    p: 'path',
    d: 'domain',
    h: 'help'
  }
});

ghpages(objectAssign({
  repo: cli.input[0],
  path: '.'
}, cli.flags), function (err, repo) {
  if (err) { throw err; }
  console.log('Published');
  console.log(repo.ghPagesUrl);
  launch(repo.ghPagesUrl);
  process.exit();
});
