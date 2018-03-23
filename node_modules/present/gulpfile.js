/*global require*/

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var exec = require('gulp-exec');
var browserResolve = require('browser-resolve');
var packageJson = require('./package.json');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('lint', function () {
  gulp.src(['**/*.js', '!**/*.min.js', '!node_modules/**/*.js', '!bower_components/**/*.js', '!coverage/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint'], function () {
  gulp.src('test/index.js')
    .pipe(exec('istanbul cover <%= file.path %>'));
});

gulp.task('build', function () {
  browserResolve('./', {}, function (err, browserFile) {
    gulp.src(browserFile)
      .pipe(browserify())
      .pipe(rename(packageJson.name + '.js'))
      .pipe(gulp.dest('.'))
      .pipe(rename(packageJson.name + '.min.js'))
      .pipe(uglify({outSourceMap: true, preserveComments: 'some'}))
      .pipe(gulp.dest('.'));
  });
});

gulp.task('default', ['test', 'build']);
