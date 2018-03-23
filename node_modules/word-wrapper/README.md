# word-wrapper

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/LqQyHSg.png)

<sup>click [here](http://mattdesl.github.io/word-wrapper/demo/) for a Canvas demo</sup>

This is a generic word wrapper for left-to-right text in 2D applications. It can be used in console, canvas, WebGL, etc. Accepts a custom `measure` function for glyph metrics. 

The simplest use-case:

```js
var text = wrap('the quick brown fox jumps over the lazy dog', { width: 8 })
console.log(text)
``` 

This will print the following:

```
the
quick
brown
fox
jumps
over the
lazy dog
```

In 2D applications it's more common to layout the text manually. For this we can use `wrap.lines()` to operate on a list of `{ start, end }` indices. Then each line can be rendered with `text.substring(line.start, line.end)`. An example:

```js
//for example...
var lines = wrap.lines(text, { width: 40 })

//operate on the lines...
var text = lines
        .map( x => text.substring(x.start, x.end) )
        .join('\n')
```

See [demo/canvas](demo/canvas.js) for a full 2D example.

## Usage

[![NPM](https://nodei.co/npm/word-wrapper.png)](https://www.npmjs.com/package/word-wrapper)

#### `text = wordwrap(text[, opt])`

Word-wraps the `text` string with the given options. Returns a string with the word-wrapped result.

- `start` the starting index to word-wrap, default 0
- `end` the ending index to word-wrap (exclusive), default `text.length`
- `width` the width to word wrap to, in 'units' (see below)
- `measure` a function that measures the number of glyphs that can fit in (see [measure](#measure)). Defaults to monospace (i.e. 1 char is 1 unit)
- `mode` can be 'pre' (maintain spacing), or 'nowrap' (collapse whitespace but only break on newline characters), otherwise assumes normal word-wrap behaviour

The `width` is measured in 'units' which could be pixels, centimeters, characters, etc. By default, one "unit" corresponds to one character (i.e. for monospace console rendering). To wrap text to a pixel width, you should use a custom [measure](#measure) function.

If mode is `"pre"` and `width` is specified, it will clip the characters to the given width (to avoid them over-flowing outside the bounds). 

#### `lines = wordwrap.lines(text[, opt])`

Takes the same parameters as the above method, but returns a list of "lines" objects for manual text layout/rendering. A "line" is typically an object with `{ start, end }` indices that can be used with `text.substring(start, end)`. The "line" is the return value from the `measure` function, so it may also include application-specific data (i.e. to avoid re-computing line widths).

## measure

To layout glyphs in 2D space, you typically will need to measure the width of each glyph (and its x-advance, kerning, etc) to determine the maximum number of glyphs that can fit within a specified *available width*. 

You can pass a custom `measure` function which takes the text being wrapped, the `start` (inclusive) and `end` (exclusive) indices into the string, and the desired `width`. The return value should be an object with `{ start, end }` indices, representing the actual glyphs that can be rendered within those bounds. 

For example, a Canvas2D implementation that uses monospace fonts might look like this:

```js
//the canvas font style
var font = '24px "Courier New", monospace'

//compute width
var measure = createMetrics(context, font)

function createMetrics(context, font) {
    context.font = font
    var charWidth = context.measureText('M').width

    return function measure(text, start, end, width) {
        //measures the chunk of text, returning the substring
        //we can fit within the given width
        var availableGlyphs = Math.floor(width/charWidth)
        var totalGlyphs = Math.floor((end-start)*charWidth)
        var glyphs = Math.min(end-start, availableGlyphs, totalGlyphs)
        return {
            start: start,
            end: start+glyphs
        }
    }
}

function draw(context) {
    var lines = wordwrap(text, { measure: measure, width: 200 })

    //draw the lines.. 
}
```

## License

The original implementation is based on [LibGDX's word wrapper](http://libgdx.badlogicgames.com/).

MIT, see [LICENSE.md](http://github.com/mattdesl/word-wrapper/blob/master/LICENSE.md) for details.
