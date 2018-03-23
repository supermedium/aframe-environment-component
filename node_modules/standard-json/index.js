module.exports = jsonify

function jsonify (rawtext, opts) {
  opts = opts || {noisey: false}
  var lines = rawtext.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()

  var results = []
  var resultMap = {}
  lines.forEach(function (line) {
    var re = /\s*([^:]+):([^:]+):([^:]+): (.*?)( \((.*)\))?$/.exec(line)
    if (!re) return opts.noisey ? console.error(line) : null

    var filePath = re[1]

    var result = resultMap[filePath]
    if (!result) {
      result = resultMap[filePath] = {
        filePath: re[1],
        messages: []
      }
      results.push(result)
    }

    result.messages.push({
      line: re[2],
      column: re[3],
      message: re[4].trim(),
      ruleId: re[6]
    })
  })

  return results
}
