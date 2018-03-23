# parse-github-url [![NPM version](https://badge.fury.io/js/parse-github-url.svg)](http://badge.fury.io/js/parse-github-url)  [![Build Status](https://travis-ci.org/jonschlinkert/parse-github-url.svg)](https://travis-ci.org/jonschlinkert/parse-github-url) 


> Parse a github URL into an object.

**Why another GitHub URL parser library?**

Seems like every lib I've found does too much, like both stringifying and parsing, or converts the URL from one format to another, only returns certain segments of the URL except for what I need, yields inconsistent results or has poor coverage. 

## Install with [npm](npmjs.org)

```bash
npm i parse-github-url --save
```

## Usage

```js
var gh = require('parse-github-url');
gh('https://github.com/jonschlinkert/micromatch');
```

Results in:

```js
{
  "user": "jonschlinkert",
  "repo": "micromatch",
  "repopath": "jonschlinkert/micromatch",
  "branch": "master"
}
```

## Example results

Generated results from test fixtures:

```js
// assemble/verb#1.2.3
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "1.2.3"
}

// assemble/verb#branch
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "branch"
}

// assemble/verb
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git+https://github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git+ssh://github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git://gh.pages.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git://github.assemble.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git://github.assemble.two.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git://github.com/assemble/verb
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git://github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git@gh.pages.com:assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// git@github.com:assemble/verb.git#1.2.3
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "1.2.3"
}

// git@github.com:assemble/verb.git#v1.2.3
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "v1.2.3"
}

// git@github.com:assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// github:assemble/verb
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// http://github.com/assemble
{
  "user": "assemble",
  "repo": null,
  "repopath": null,
  "branch": "master"
}

// http://github.com/assemble/verb
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// http://github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// http://github.com/assemble/verb/tree
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// http://github.com/assemble/verb/tree/master
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// http://github.com/assemble/verb/tree/master/foo/bar
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master/foo/bar"
}

// https://assemble.github.com/assemble/verb/somefile.tar.gz
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://assemble.github.com/assemble/verb/somefile.zip
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://assemble@github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://gh.pages.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/assemble/verb
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/assemble/verb.git
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/assemble/verb/blob/1.2.3/README.md
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "1.2.3"
}

// https://github.com/assemble/verb/blob/249b21a86400b38969cee3d5df6d2edf8813c137/README.md
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/assemble/verb/blob/master/assemble/index.js
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/assemble/verb/tree/1.2.3
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "1.2.3"
}

// https://github.com/assemble/verb/tree/feature/1.2.3
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "feature/1.2.3"
}

// https://github.com/repos/assemble/verb/tarball
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}

// https://github.com/repos/assemble/verb/zipball
{
  "user": "assemble",
  "repo": "verb",
  "repopath": "assemble/verb",
  "branch": "master"
}
```

## Related projects
[is-git-url](https://github.com/jonschlinkert/is-git-url): Regex to validate that a URL is a git url.  

## Running tests
Install dev dependencies:

```bash
npm i -d && npm test
```


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/parse-github-url/issues)


## Author

**Jon Schlinkert**

 + [github/jonschlinkert](https://github.com/jonschlinkert) 
 + [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 


## License
Copyright (c) 2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on March 25, 2015._
