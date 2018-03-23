'use strict';

var expect = require('chai').expect;
var request = require('request');
var connect = require('connect');
var serveStatic = require('serve-static');
var pushState = require('../index');
var www = __dirname + '/fixtures/www';

describe('pushState', function() {
  var app = connect()
    .use(pushState())
    .use(serveStatic(www));

  it('calls the next middleware', function(done) {
    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('www/index.html');
        server.close(done);
      });
    });
  });

  it('rewrites the request url to point at the root when the request does not include a file extension', function(done) {
    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/pathname', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('www/index.html');
        server.close(done);
      });
    });
  });

  it('rewrites the request url to point at the root regardless of whether the querystring contains a file extension', function(done) {
    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/pathname/?q=foo.bar', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('www/index.html');
        server.close(done);
      });
    });
  });

  it('does not rewrite the request url when the request includes a file extension', function(done) {
    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/images/image.png', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(res.headers['content-type']).to.contain('image/png');
        server.close(done);
      });
    });
  });

  it('rewrites the request url to point at a custom root if defined', function(done) {
    var app = connect()
      .use(pushState({ root: '/other/' }))
      .use(serveStatic(www));

    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/other/pathname', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('www/other/index.html');
        server.close(done);
      });
    });
  });

  it('does not rewrite the request url when specified as allowed', function(done) {
    var app = connect()
      .use(pushState({ allow: '^/api' }))
      .use(serveStatic(www))
      .use('/api/users', function(req, res, next) {
        res.end('users');
      });

    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/api/users', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('users');
        server.close(done);
      });
    });
  });

  it('rewrites the request url when specified as disallowed', function(done) {
    var app = connect()
      .use(pushState({ disallow: '^/version' }))
      .use(serveStatic(www))
      .use('/version', function(req, res, next) {
        res.end('version');
      });

    var server = app.listen(3000).on('listening', function() {
      request('http://0.0.0.0:3000/version/1.2.3', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain('www/index.html');
        server.close(done);
      });
    });
  });
});
