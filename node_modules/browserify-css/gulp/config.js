var _ = require('lodash');
var fse = require('fs-extra');
var path = require('path');
var gutil = require('gulp-util');
var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * <%= pkg.author %>',
    ' * Version <%= pkg.version %>',
    ' * <%= pkg.license %> Licensed',
    ' */',
    ''].join('\n');

module.exports = {
    banner: banner,
    clean: {
        examples: [
            'examples/submodules/bundle.js'
        ]
    },
    jshint: {
        src: [
            '*.js',
            '*.json',
            'examples/**/*.js',
            '!examples/**/bundle.js',
            '!**/node_modules/**'
        ],
        options: require('../config/jshint')
    },
    bundles: {
        submodules: {
            src: './examples/submodules/index.js',
            dest: './examples/submodules/',
            options: {
                debug: true
            },
            transform: {
                'browserify-css': {
                    'autoInject': true,
                    'autoInjectOptions': {
                        'verbose': true
                    },
                    'rootDir': 'examples/submodules',
                    'rebaseUrls': true,
                    'minify': true,
                    'processRelativeUrl': function(relativeUrl) {
                        var stripQueryStringAndHashFromPath = function(url) {
                            return url.split('?')[0].split('#')[0];
                        };
                        var rootDir = path.resolve(process.cwd(), 'examples/submodules');
                        var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
                        var queryStringAndHash = relativeUrl.substring(relativePath.length);

                        //
                        // Copying files from '../node_modules/bootstrap/' to 'vendor/bootstrap/'
                        //
                        var prefix = '../node_modules/';
                        if (_.startsWith(relativePath, prefix)) {
                            var newUrl = 'vendor/' + relativePath.substring(prefix.length);
                            var source = path.join(rootDir, relativePath);
                            var target = path.join(rootDir, newUrl);

                            gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
                            fse.copySync(source, target);

                            // Returns a new url with original query string and hash fragments
                            return newUrl + queryStringAndHash;
                        }

                        return url;
                    }
                }
            }
        }
    }
};
