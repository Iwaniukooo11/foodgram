const { src, dest, series, watch, parallel } = require('gulp'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config.js'),
  minifyCSS = require('gulp-clean-css'),
  minifyJS = require('gulp-minify'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  // browserSync = require('browser-sync').create(),
  cleaner = require('gulp-clean'),
  wait = require('gulp-wait')

sass.compiler = require('node-sass')
const time = 20

function hello() {
  console.log('Hello!')
}
exports.hello = hello

function copy() {
  console.log('COPY!!!')
  return src('./public/src/html/*.html')
    .pipe(wait(time))
    .pipe(dest('./public/dist/'))
}

function assets() {
  return src('./public/src/assets/**/*')
    .pipe(wait(time))
    .pipe(dest('./public/dist/assets'))
}

function images() {
  return src('./public/src/images/*')
    .pipe(wait(time))
    .pipe(imagemin())
    .pipe(dest('dist/assets/images'))
}

function js() {
  return src('./public/src/js/*.js')
    .pipe(wait(time))
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(
      minifyJS({
        ext: {
          min: '.min.js',
        },
      })
    )
    .pipe(dest('./public/dist/js/'))
}

function css() {
  return src('./public/src/scss/*.scss')
    .pipe(wait(time))
    .pipe(sass().on('error', sass.logError))
    .pipe(
      sass({
        includePaths: ['node_modules'],
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 1 versions'],
        cascade: false,
      })
    )
    .pipe(
      minifyCSS({
        compatibility: 'ie8',
      })
    )
    .pipe(dest('./public/dist/css/'))
}

function reload() {
  browserSync.init({
    server: {
      baseDir: './public/dist/',
    },
  })
  console.log('reload')
}

function log() {
  console.log('end')
}

function watcher() {
  // watch("./public/src/html/**/*.html").on(
  //   "change",
  //   series(copy, browserSync.reload, log)
  // );
  // watch('./public/src/html/**/*.html').on('change', series(copy))
  watch('./public/src/js/**/*').on('change', series(js))
  watch('./public/src/scss/**/*.scss').on(
    'change',
    series(css)
    // parallel(css, browserSync.reload)
  )
  watch('./public/src/assets/**/*').on('change', assets)
}

function clean() {
  return src('./public/dist/', {
    read: false,
    allowEmpty: true,
  })
    .pipe(wait(10))
    .pipe(cleaner())
}

exports.js = js
// exports.copy = copy
exports.css = css
// exports.reload = reload;
exports.build = series(clean, js, css, images, assets)
exports.default = series(
  clean,
  js,
  // copy,
  css,
  images,
  assets,
  parallel(watcher)
)
