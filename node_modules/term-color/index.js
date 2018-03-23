'use strict';

var supportsColor = require('supports-color');
var ansiStyles = require('ansi-styles');

var TermColor = {
    black: buildColor('black'),
    red: buildColor('red'),
    green: buildColor('green'),
    yellow: buildColor('yellow'),
    blue: buildColor('blue'),
    magenta: buildColor('magenta'),
    cyan: buildColor('cyan'),
    white: buildColor('white'),
    gray: buildColor('gray'),
    bgBlack: buildColor('bgBlack'),
    bgRed: buildColor('bgRed'),
    bgGreen: buildColor('bgGreen'),
    bgYellow: buildColor('bgYellow'),
    bgBlue: buildColor('bgBlue'),
    bgMagenta: buildColor('bgMagenta'),
    bgCyan: buildColor('bgCyan'),
    bgWhite: buildColor('bgWhite'),
    reset: buildColor('reset'),
    bold: buildColor('bold'),
    dim: buildColor('dim'),
    italic: buildColor('italic'),
    underline: buildColor('underline'),
    inverse: buildColor('inverse'),
    hidden: buildColor('hidden'),
    strikethrough: buildColor('strikethrough')
};

TermColor.enabled = supportsColor;

module.exports = TermColor;

function buildColor(colorName) {
    return function colorFn(str) {
        if (!TermColor.enabled) {
            return str;
        }

        var code = ansiStyles[colorName];

        return code.open + str + code.close;
    };
}
