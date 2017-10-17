const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');

const plugins = require('gulp-load-plugins')();

const dev = true;

function lint(files) {
  return gulp.src(files)
    .pipe(plugins.eslint({ fix: true }))
    .pipe(plugins.eslint.format());
}

gulp.task('lint', () =>
  lint('src/**.js')
    .pipe(gulp.dest('src')));

gulp.task('lint:test', () =>
  lint('test/**.js')
    .pipe(gulp.dest('test')));

gulp.task('tests', () => gulp.src(['test/**/*.js'], { read: false })
  .pipe(plugins.mocha({
    timeout: 0,
  })));

