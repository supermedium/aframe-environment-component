# layout-bmfont-text

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

![screenshot](http://i.imgur.com/fDIH2z9.png)

[(click for canvas demo)](https://Jam3.github.io/layout-bmfont-text/demo)

Provides layout and word-wrapping for left-to-right Latin text, primarily aimed at bitmap font rendering in Canvas/WebGL. The input font should be in the format of BMFont json, see [here](https://github.com/Jam3/load-bmfont/blob/master/json-spec.md). 

You can use [bmfont-lato](https://www.npmjs.com/package/bmfont-lato) for testing, or [load-bmfont](https://www.npmjs.com/package/load-bmfont) for Node/Browser loading.

```js
var createLayout = require('layout-bmfont-text')
var loadFont = require('load-bmfont')

loadFont('fonts/Arial.fnt', function(err, font) {
  var layout = createLayout({
    font: font,
    text: 'Lorem ipsum dolor\nsit amet',
    width: 300,
    letterSpacing: 2,
    align: 'center'
  })

  //for rendering
  console.log(layout.glyphs)

  //metrics
  console.log(layout.width, layout.height)
  console.log(layout.descender, layout.ascender)
})
```

Features:

- uses [word-wrapper](https://npmjs.com/package/word-wrapper) for layout
  - supports `"pre"` and `"nowrap"` modes (like CSS)
  - breaks on explicit newline characters `"\n"`
- handles `"left"`, `"center"` and `"right"` alignments
- handles kerning, letter spacing, line height
- handles space and tab widths
- provides computed bounds of resulting text box
- provides metrics for ascender, descender, x-height, etc

Comments/suggestions/PRs welcome.

## Usage

[![NPM](https://nodei.co/npm/layout-bmfont-text.png)](https://www.npmjs.com/package/layout-bmfont-text)

#### `layout = createLayout(opt)`

Creates a new layout with the given options.

- `font` (required) the BMFont definition which holds chars, kernings, etc
- `text` (string) the text to layout. Newline characters (`\n`) will cause line breaks
- `width` (number, optional) the desired width of the text box, causes word-wrapping and clipping in `"pre"` mode. Leave as undefined to remove word-wrapping (default behaviour)
- `mode` (string) a mode for [word-wrapper](https://www.npmjs.com/package/word-wrapper); can be 'pre' (maintain spacing), or 'nowrap' (collapse whitespace but only break on newline characters), otherwise assumes normal word-wrap behaviour (collapse whitespace, break at width or newlines)
- `align` (string) can be `"left"`, `"center"` or `"right"` (default: left)
- `letterSpacing` (number) the letter spacing in pixels (default: 0)
- `lineHeight` (number) the line height in pixels (default to `font.common.lineHeight`)
- `tabSize` (number) the number of spaces to use in a single tab (default 4)
- `start` (number) the starting index into the text to layout (default 0)
- `end` (number) the ending index (exclusive) into the text to layout (default `text.length`)

#### `layout.update(opt)`

Updates the layout, all options are the same as in constructor.

#### `layout.glyphs`

An array of laid out glyphs that can be used for rendering. Each glyph looks like this:

```js
{
    index: Number,    //the index of this glyph into the string
    data: {...},      //the BMFont "char" object for this glyph
    position: [x, y], //the baseline position to render this glyph
    line: Number      //the line index this glyph appears in
}
```

All positions are relative to the bottom-left baseline of the text box (i.e. the last line). 

#### `layout.width`

The width of the text box, or the width provided in constructor. 

#### `layout.height`

The height of the text box; from baseline to the top of the ascender.

## metrics

#### `layout.baseline`

The baseline metric: measures top of text layout to the baseline of the first line.

#### `layout.xHeight`

The x-height metric; the height of a lowercase character. Uses the first available height of the common lowercase Latin "x-chars", such as 'x', 'u', 'v', 'w', 'z'. 

#### `layout.descender`

The metric from baseline to the bottom of the descenders (like the bottom of a lowercase "g").

#### `layout.ascender`

The metric for ascenders; typically from the top of x-height to the top of the glyph height.

#### `layout.capHeight`

The cap height metric; the height of a flat uppercase letter like 'H' or 'I'. Uses the frist available height of common uppercase Latin flat capitals, such as 'H', 'I', 'E', 'T', 'K'.

#### `layout.lineHeight`

The line height; the height from one baseline to the next. This is what was passed as `opt.lineHeight`, or defaults to the `font.common.lineHeight`.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/layout-bmfont-text/blob/master/LICENSE.md) for details.
