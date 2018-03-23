var wrap = require('./')
var lines = wrap.lines
var test = require('tape')

var pre = JSON.stringify(require('./package.json'), undefined, 2)

test('wraps monospace glyphs by columns', function(t) {
    t.equal(wrap(pre, { mode: 'pre' }), pre, 'pre does not change text')
    t.equal(wrap(pre, { mode: 'pre', width: 20 }), chop(pre, 20), 'pre with width will clip text')

    var text = 'lorem   ipsum \t dolor sit amet'
    var multi = 'lorem\nipsum dolor sit amet'
    t.equal(wrap(text), text, 'text with no width is unchanged')
    t.equal(wrap(multi), multi, 'text with newlines is multi-lined')
    t.equal(wrap(text, { width: 10 }), 'lorem\nipsum\ndolor sit\namet', 'word-wrap with N width')
    
    var overflow = 'it overflows'
    t.equal(wrap(overflow, { width: 5 }), 'it\noverf\nlows', 'overflow text pushed to next line')
    
    var nowrap = 'this text  \n  only wraps \nnewlines'
    t.equal(wrap(nowrap, { mode: 'nowrap' }), 'this text  \nonly wraps \nnewlines', 'eats starting whitespace')

    t.equal(wrap(''), '')
    t.equal(wrap('this is not visible', { width: 0 }), '', 'zero width results in empty string')
    t.equal(wrap('this is not visible', { width: 0, mode: 'pre' }), '', 'zero width results in empty string')
    t.equal(wrap('this is not\nvisible', { width: 0, mode: 'nowrap' }), 'this is not\nvisible', 'zero width nowrap does not result in empty string')
    t.equal(wrap('test some text'), 'test some text')

    t.end()
})

test('wrap a sub-section', function(t) {
    var str = 'the quick brown fox jumps over the lazy dog'

    //word-wrap the entire sentence
    var text = wrap(str, { width: 10 })

    //bits at a time
    var start = 20
    var end = 30
    var text0 = wrap(str, { width: 10, start: start, end: end })
    var text1 = wrap(str, { width: 10, start: end })

    t.equal(text0, 'jumps over', 'only word-wraps a sub-section of text')
    t.equal(text1, 'the lazy\ndog', 'only word-wraps a sub-section of text')
    t.end()
})

test('custom compute function', function(t) {
    //a custom compute function that assumes pixel width instead of monospace char width
    var word = 'words'
    t.deepEqual(compute2(word, 0, word.length, 4), { end: 0, start: 0, width: 0 }, 'test compute')
    t.deepEqual(compute2(word, 0, word.length, 5), { end: 1, start: 0, width: 5 }, 'test compute')

    var text = 'some lines'
    t.equal(wrap(text, { width: 20, measure: compute2 }), 'some\nline\ns', 'cuts text with variable glyph width')
    t.end()
})

test('wraps text to a list of lines', function(t) {
    var expected = [ { end: 9, start: 0 }, { end: 15, start: 10 } ]
    t.deepEqual(lines('the quick brown', { width: 10 }), expected, 'returns a list of substring indices')
    t.end()
})

function compute2(text, start, end, width) {
    //assume each glyph is Npx monospace
    var pxWidth = 5
    var availableGlyphs = Math.floor(width/pxWidth)
    var totalGlyphs = Math.floor((end-start)*pxWidth)
    var glyphs = Math.min((end-start), availableGlyphs, totalGlyphs)

    return {
        width: glyphs * pxWidth, //only used for unit test
        start: start,
        end: start+glyphs
    }
}

function chop(text, width) {
    return text.split(/\n/g).map(function(str) {
        return str.substring(0, width)
    }).join('\n')
}