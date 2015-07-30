'use strict';

var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    gulpJshint = require('gulp-jshint'),

    chalk = require('chalk'),
    jshintStylish = require('jshint-stylish');

function jshint() {
    return gulp.src(['**/*.js', 
                     '!node_modules/**/*.js'])
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter(jshintStylish));
}
gulp.task('jshint', jshint);

function jshintWatch() {
    jshint();
    gulpWatch(['**/*.js', 
               '!node_modules/**/*.js'], function () {
        console.log(chalk.black.bold.bgYellow('--- JS Hint ---'));
        jshint();
    });
}
gulp.task('jshintWatch', jshintWatch);