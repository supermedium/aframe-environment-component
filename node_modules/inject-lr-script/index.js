var respModifier = require('resp-modifier')
var path = require('path')

module.exports = injectLiveReloadSnippet
function injectLiveReloadSnippet (opts) {
  opts = opts || {}

  var modifier = respModifier({
    rules: [
      { match: /<body[^>]*>/i, fn: prepend }
    ]
  })

  var fn = function (req, res, next) {
    var ext = path.extname(req.url)
    if (!ext || /\.html?$/i.test(ext)) {
      if (!req.headers.accept) {
        req.headers.accept = 'text/html'
      }
    }
    modifier(req, res, next)
  }

  fn.host = opts.host
  fn.port = opts.port
  fn.path = opts.path
  fn.local = opts.local

  function snippet () {
    var host = fn.host || 'localhost'
    var port = fn.port || 35729
    var scriptPath = fn.path || '/livereload.js?snipver=1'
    var src = fn.local ? scriptPath : ('//' + host + ':' + port + scriptPath)
    return '<script type="text/javascript" src="' + src + '" async="" defer=""></script>'
  }

  function prepend (req, res, body) {
    return body + snippet()
  }

  return fn
}
