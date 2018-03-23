// parses a syntax error for pretty-printing to console
module.exports = parseError
function parseError (err) {
  if (err.codeFrame) { // babelify@6.x
    return [err.message, err.codeFrame].join('\n\n')
  } else { // babelify@5.x and browserify
    return err.annotated || err.message
  }
}
