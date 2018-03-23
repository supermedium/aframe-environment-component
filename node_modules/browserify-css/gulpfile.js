'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
var tasks = requireDir('./gulp/tasks', {recursive: true});

_.each(tasks, function(task, relativePath) {
    console.assert(_.isFunction(task), 'gulp/tasks/%s: module\'s export is not a function', relativePath);
    task({
        config: require('./gulp/config'),
        errorHandler: require('./gulp/error-handler')
    });
});

gulp.task('default', ['build']);
