/**
 * Created by gs on 2/24/2016.
 */

//load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    //autoprefixer = require('gulp-autoprefixer'),
    //minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    path = require('path');

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: "Error: <%= error.message %>"
    })
};

//material
gulp.task('styles', function () {
    return gulp.src('./my_components/materialize/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./my_components/materialize/dist/css'))

        //.pipe(rename({suffix: '.min'}))
        //.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        //.pipe(gulp.dest('./my_components/materialize/dist/css'))
});

//scripts
gulp.task('scripts', function () {
    return gulp.src([
            //'./app.js'
        ])
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('w'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('w'));
});

//watch
gulp.task('watch', function () {
    livereload.listen();

    gulp.watch('./my_components/materialize/sass/**/*.scss', ['styles']);

    //watch .js files
    //gulp.watch('./**/*.js', ['scripts']);

});