'use strict';

var _ = require('lodash');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var cssTransform = require('./css-transform');
var CleanCSS = require('clean-css');

var defaults = {
    'autoInject': true,
    'autoInjectOptions': {
        'verbose': true
    },
    'minify': false,
    'minifyOptions': {
        // Check out a list of CSS minify options at [CleanCSS](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically).
    },
    'rebaseUrls': true,
    'rootDir': process.cwd()
};

try {
    var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json') || '{}');
    var options = pkg['browserify-css'] || defaults;
    if (typeof options === 'string') {
        var base = path.relative(__dirname, process.cwd());
        options = require(path.join(base, options)) || defaults;
    }
} catch (err) {
    options = defaults;
}
options = _.defaults(options, defaults);

module.exports = function(filename, opts) {
    if ( ! /\.css$/i.test(filename)) {
        return through();
    }

    var buffer = '';

    options = _.extend({}, options, opts);

    return through(
        function transform(chunk, enc, next) {
            buffer += chunk;
            next();
        },
        function flush(done) {
            var that = this;

            cssTransform.call(this, options, filename, function(data) {
                var moduleBody = '';
                var rootDir = path.resolve(process.cwd(), options.rootDir);
                var relativePath = path.relative(rootDir, path.dirname(filename));
                var href = path.join(relativePath, path.basename(filename));

                if (options['minify']) {
                    data = new CleanCSS(options['minifyOptions']).minify(data);
                }

                if ( ! options['autoInject']) {
                    moduleBody = 'module.exports = ' + JSON.stringify(data) + ';';
                } else {
                    if (options.autoInjectOptions['verbose']) {
                        moduleBody = 'var css = ' + JSON.stringify(data) + '; (require(' + JSON.stringify('browserify-css') + ').createStyle(css, { "href": ' + JSON.stringify(href) + '})); module.exports = css;';
                    } else {
                        moduleBody = 'var css = ' + JSON.stringify(data) + '; (require(' + JSON.stringify('browserify-css') + ').createStyle(css)); module.exports = css;';
                    }
                }

                that.push(moduleBody);
                that.push(null);
                done();
            });
        }
    );
};
