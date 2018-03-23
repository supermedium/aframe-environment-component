//This demo shows off custom text rendering and measuring.
//It cycles through a few different examples.

var wrap = require('../')

//our font for the canvas
var fontStyle = '12px "Courier New", monospace'
var lineHeight = 15

//some sample text to word-wrap
var code = JSON.stringify(require('../package.json'), undefined, 2)
var lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus, elit nec rutrum interdum, ipsum nulla auctor magna, ut tincidunt turpis ex efficitur orci. Aenean maximus interdum diam, nec consequat sapien ullamcorper ac. In et tortor dictum, commodo enim ac, sodales dolor.'
var multiline = 'the quick\nbrown\n\nfox jumps over the\nlazy dog'

//create a canvas2d
var context = require('2d-context')({ 
    width: window.innerWidth, 
    height: window.innerHeight 
})

//setup font metrics
var metrics = createMetrics(context, fontStyle)

//some examples to see different modes and text
var slides = [ {
        text: lipsum, description: 'normal at 200px',
        width: 200,
        measure: metrics
    }, {
        text: multiline, description: 'nowrap (newline only)',
        mode: 'nowrap',
        measure: metrics
    }, {
        text: code, description: 'pre',
        mode: 'pre'
    }, {
        text: code, description: 'pre clipped to 200px',
        mode: 'pre',
        clip: true,
        width: 200,
        measure: metrics
    } ]

//This will wordwrap and draw the example "slide" 
function draw(context, opt) {
    var text = opt.text

    //wrap the text and get back a list of lines
    var lines = wrap.lines(text, opt)
    
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.save()
    context.translate(20, 20)

    //now draw each line
    context.font = fontStyle
    lines.forEach(function (line, i) {
        var str = text.substring(line.start, line.end)
        context.fillText(str, 0, 0 + i * lineHeight)
    })

    context.restore()
}

function createMetrics(context, font) {
    context.font = font
    var charWidth = context.measureText('M').width

    return function measure(text, start, end, width) {
        //measures the chunk of text, returning the substring
        //we can fit within the given width
        var availableGlyphs = Math.floor(width/charWidth)
        var totalGlyphs = Math.floor((end-start)*charWidth)
        var glyphs = Math.min((end-start), availableGlyphs, totalGlyphs)
        return {
            start: start,
            end: start+glyphs
        }
    }
}

//a little helper to show the current state
function createInfo() {
    var div = document.body.appendChild(document.createElement('div'))
    return function(text) {
        div.innerHTML = text
    }
}


//once the dom is ready, load up our app
require('domready')(x => {
    var info = createInfo()
    document.body.appendChild(context.canvas)

    var index = 0

    //start app
    change(slides[index])

    //cycle through modes
    setInterval(function() {
        index++
        change(slides[index % slides.length])
    }, 2500)

    function change(slide) {
        draw(context, slide)
        info(slide.description)
    }
})