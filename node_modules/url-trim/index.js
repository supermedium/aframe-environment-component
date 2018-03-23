var urlLib = require('url')

module.exports = stripUrl
function stripUrl (url) {
  if (!url) return ''
  var obj = urlLib.parse(url)
  obj.search = ''
  obj.hash = ''
  obj.query = ''
  obj.pathname = (obj.pathname || '').replace(/\/+$/, '/')
  url = urlLib.format(obj)
  return url || '/'
}
