'use strict';

// Requires
const gulp        = require('gulp');
const rename      = require("gulp-rename");
const runSequence = require('run-sequence');
const sizeOf      = require('image-size');

// Include plugins
const plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
const sources            = ['app/views/js/**.js'];
const imageSource        = 'app/views/img/**';
const imageSourceResize  = 'app/dist/img/**';
const libSources         = ['node_modules/preact/**', 'node_modules/preact-compat/**', 'node_modules/superagent/**'];
const libDest            = 'app/libs/';
const indexSource        = 'app/index.html';
const destination        = 'app/dist';
const pathDocs           = ['./docs/docco/', './docs/jsdoc/'];

const ImageResizeMobile = 300;

const onlyBigIMG = (file) => {
  return sizeOf(file.path).width > ImageResizeMobile;
};

// Tâche "watch"
gulp.task('watch', () => {
});

gulp.task('clean', () => {
  return gulp.src(destination, {read: false})
    .pipe(plugins.clean());
});

gulp.task('cleanDoc', () => {
  return gulp.src(pathDocs, {read: false})
    .pipe(plugins.clean());
});

gulp.task('cleanLib', () => {
  return gulp.src(libDest, {read: false})
    // .pipe(plugins.plumber())
    .pipe(plugins.clean());
});

gulp.task('docco', ['cleanDoc'], () => {
  return gulp.src(sources)
    .pipe(plugins.docco())
    .pipe(gulp.dest('./docs/docco'));
});

gulp.task('jsdoc', ['cleanDoc'], (cb) => {
  var config = require('./confJSDoc.json');
  gulp.src(sources)
    .pipe(plugins.jsdoc3(config, cb));
});

gulp.task('optimizeImg', function () {
  gulp.src(imageSourceResize, { nodir: true })
    .pipe(plugins.image())
    .pipe(gulp.dest(`${destination}/Img`))
    .pipe(plugins.webp({method: 6}))
    .pipe(gulp.dest(`${destination}/Img`));
});

gulp.task('resizeImg', function () {
  gulp.src(imageSource, { nodir: true })
    .pipe(gulp.dest(`${destination}/Img`));
  gulp.src(imageSource, { nodir: true })
    .pipe(plugins.ignore.exclude('*.svg'))
    .pipe(plugins.ignore.exclude('**/OPTIMIZED*'))
    .pipe(plugins.if(onlyBigIMG, plugins.imageResize({
      width: ImageResizeMobile,
      quelity: 1
    })))
    .pipe(plugins.if(onlyBigIMG, rename(function (path) {
      path.basename += `-${ImageResizeMobile}`;
    })))
    .pipe(gulp.dest(`${destination}/Img`));
});

gulp.task('prod', () => {
  return gulp.src(indexSource)
    .pipe(plugins.plumber())
    .pipe(plugins.useref())
    .pipe(gulp.dest(destination));
});

gulp.task('dev', ['cleanLib'], () => {
  return gulp.src(libSources)
    .pipe(plugins.copy(libDest));
});

gulp.task('build', (callback) => {
  runSequence('clean', 'resizeImg', 'prod', callback);
});

gulp.task('docs', ['docco', 'jsdoc'], () => {
});

// Tâche par défaut
gulp.task('default', ['dev'], () => {
});