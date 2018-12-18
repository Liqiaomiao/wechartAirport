const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const rename = require('gulp-rename')

const src = './src'
const dist = './dist'

gulp.task('clean:dist', done =>
  del([`${dist}`])
)

gulp.task('build:js', done =>
  gulp.src([`${src}/**/*.js`])
    .pipe(babel())
    .pipe(gulp.dest(`${dist}`))
)

gulp.task('build:wxss', done =>
  gulp.src(`${src}/**/*.scss`)
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(rename(path => {
      path.extname = '.wxss'
    }))
    .pipe(gulp.dest(`${dist}`))
)

gulp.task('build:wxml', done =>
  gulp.src(`${src}/**/*.wxml`)
    .pipe(gulp.dest(`${dist}`))
)

gulp.task('build:others', done =>
  gulp.src([`${src}/**/*.*`, `!${src}/**/*.js`, `!${src}/**/*.scss`, `!${src}/**/*.wxml`])
    .pipe(gulp.dest(`${dist}`))
)

// run 'gulp watch:src'
gulp.task('watch:src', done =>
  gulp.watch(`${src}/**/*.*`, gulp.series('build:others', 'build:js', 'build:wxss', 'build:wxml'))
)

// run 'gulp'
gulp.task('default', gulp.series('clean:dist', 'build:others', 'build:js', 'build:wxss', 'build:wxml'))
