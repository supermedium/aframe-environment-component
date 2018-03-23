/* global describe, it */

var stacked = require('../stacked')
  , expect = require('chai').expect
  , connect = require('connect')
  , request = require('supertest')

describe('stacked()', function () {
  describe('.use(layer)', function () {
    it('execute as middleware', function (done) {
      var app = connect()
      var pack = stacked()
      var middleware1Called = false
      var middleware2Called = false

      pack.use(function (req, res, next) {
        middleware1Called = true
        next()
      })

      pack.use(function (req, res, next) {
        middleware2Called = true
        res.statusCode = 200
        res.end()
      })

      app.use(pack)

      request(app)
        .get('/')
        .expect(200)
        .expect(function () {
          expect(middleware1Called).to.equal(true)
          expect(middleware2Called).to.equal(true)
        })
        .end(done)
    })
  })

  describe('.use(layer, layer)', function () {
    it('execute as middleware', function (done) {
      var app = connect()
      var middleware1Called = false
      var middleware2Called = false
      var pack = stacked(
        function (req, res, next) {
          middleware1Called = true
          next()
        },
        function (req, res, next) {
          middleware2Called = true
          res.statusCode = 200
          res.end()
        }
      )

      app.use(pack)

      request(app)
        .get('/')
        .expect(200)
        .expect(function () {
          expect(middleware1Called).to.equal(true)
          expect(middleware2Called).to.equal(true)
        })
        .end(done)
    })
  })

  describe('.layers', function () {
    it('is exposed on object', function () {
      var pack = stacked()
      var layer = function (req, res, next) {
        next()
      }
      pack.use(layer)

      expect(pack.layers.length).to.equal(1)
      expect(pack.layers[0].toString()).to.equal(layer.toString())
    })
  })

  describe('.mount(path, fn)', function () {
    it('executes at the given path', function (done) {
      var app = connect()
      var pack = stacked()
      var mountedMiddleware1Called = false
      var mountedMiddleware2Called = false

      pack.mount('/mount1', function (req, res, next) {
        mountedMiddleware1Called = true
        next()
      })

      pack.mount('/mount2', function (req, res, next) {
        mountedMiddleware2Called = true
        next()
      })

      app.use(pack)

      request(app)
        .get('/mount1')
        .expect(function () {
          expect(mountedMiddleware1Called).to.equal(true)
          expect(mountedMiddleware2Called).to.equal(false)
        })
        .end(done)
    })
  })
})
