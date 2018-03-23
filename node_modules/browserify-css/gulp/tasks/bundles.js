var _ = require('lodash');
var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var sourceStream = require('vinyl-source-stream');
var exorcist = require('exorcist');

module.exports = function(options) {
    var tasks = [];

    _.each(options.config.bundles, function(bundleConfig, key) {
        var task = 'bundle:' + key;

        gulp.task(task, function() {
            var bundleTransform = bundleConfig.transform;
            var bundleFile = 'bundle.js';
            var bundleMapFile = path.join(bundleConfig.dest, 'bundle.js.map');

            return browserify(bundleConfig.options)
                .add(bundleConfig.src)
                .transform(require('../../index'), bundleTransform['browserify-css'])
                .require('./browser', {expose: 'browserify-css'})
                .bundle()
                .pipe(exorcist(bundleMapFile))
                .pipe(sourceStream(bundleFile))
                .pipe(gulp.dest(bundleConfig.dest));
        });

        tasks.push(task);
    });

    gulp.task('bundles', tasks);
};
