var gulp = require('gulp');
var distRoot = require('./gulp-config.json').distRoot;
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var env = require('gulp-env');
var del = require('del');

requireDir('./tasks');

// Gulp needs to perform the following tasks:
// * Compile front end assets - JS / CSS / HTML (requires watch)
// 
// Directory structure is as follows:
// - src/
//    - scss/
//    - js/
//    - index.html
// - dist/
//    - css/
//    - js/
//    - index.html

// Setup env.
gulp.task('set-env:development', function () {
  env({
    vars: {
      NODE_ENV: 'development'
    }
  });
});
gulp.task('set-env:production', function () {
  env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});

gulp.task('clean', function () {
  return del([distRoot]);
});

// Compile static assets.
gulp.task('compile-assets', ['compile:jshint', 'compile:js', 'compile:html', 'compile:public', 'compile:scss']);

// Build tasks.
gulp.task('build:development', function (callback) {
  runSequence('clean', 'set-env:development', 'compile-assets', callback);
});
gulp.task('build:production', function (callback) {
  runSequence('clean', 'set-env:production', 'compile-assets', callback);
});

// Alias for production build.
gulp.task('build', ['build:production']);

// Watch task (will also do initial build).
gulp.task('watch', ['watch:jshint', 'watch:js', 'watch:html', 'watch:public', 'watch:scss']);

// Fake live environement.
gulp.task('faux-production', function(callback) {
  runSequence('clean', 'set-env:production', 'watch', 'dev-server', callback);
});

// Default task.
gulp.task('default', function(callback) {
  runSequence('clean', 'set-env:development', 'watch', 'dev-server', callback);
});
