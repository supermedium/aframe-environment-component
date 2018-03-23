'use strict';

var connect = require('connect');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var pushState = require('../index');
var port = process.env.PORT || 3000;

var app = connect()
  .use(pushState())
  .use(serveStatic('../test/fixtures/www/'))
  .use(morgan('dev'))
  .listen(port, function() {
    console.log('Application server stated on port', port);
  });
