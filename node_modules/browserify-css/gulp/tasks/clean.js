var gulp = require('gulp');
var del = require('del');

module.exports = function(options) {
    /**
     * Delete folder and files
     */
    gulp.task('clean', function(callback) {
        var cleanConfig = options.config.clean;
        del(cleanConfig.examples, callback);
    });
};
