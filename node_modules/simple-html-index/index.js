const fromString = require('from2-string')

const favicon = '<link rel="shortcut icon"type="image/x-icon"' +
  ' href="data:image/x-icon;,">'

module.exports = createHtml

function createHtml (opt) {
  opt = opt || {}
  return fromString([
    '<!DOCTYPE html>',
    '<html lang="' + (opt.lang || 'en') + '" dir="' + (opt.dir || 'ltr') + '">',
    '<head>',
    opt.title ? ('<title>' + opt.title + '</title>') : '',
    '<meta charset="utf-8">',
    opt.base ? ('<base href="' + opt.base + '">') : '',
    opt.css ? ('<link rel="stylesheet" href="' + opt.css + '">') : '',
    opt.favicon ? favicon : '',
    '</head><body>',
    opt.entry ? ('<script src="' + opt.entry + '"></script>') : '',
    '</body>',
    '</html>'
  ].join(''))
}
