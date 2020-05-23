const { src, dest, series, watch, parallel } = require('gulp'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config.js'),
  minifyCSS = require('gulp-clean-css'),
  minifyJS = require('gulp-minify'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
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
  return src('./frontend/src/html/*.html')
    .pipe(wait(time))
    .pipe(dest('./public/dist/'))
}

function assets() {
  return src('./frontend/src/assets/**/*')
    .pipe(wait(time))
    .pipe(dest('./public/dist/assets'))
}

function images() {
  return src('./frontend/src/images/*')
    .pipe(wait(time))
    .pipe(imagemin())
    .pipe(dest('dist/assets/images'))
}

function js() {
  return src('./frontend/src/js/*.js')
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
  return src('./frontend/src/scss/*.scss')
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
  watch('./frontend/src/js/**/*').on('change', series(js))
  watch('./frontend/src/scss/**/*.scss').on('change', series(css))
  watch('./frontend/src/assets/**/*').on('change', assets)
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
exports.css = css
exports.build = series(clean, js, css, images, assets)
exports.default = series(clean, js, css, images, assets, parallel(watcher))
