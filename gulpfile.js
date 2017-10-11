const gulp = require('gulp');

const plugins = require('gulp-load-plugins')();

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

gulp.task('default', () => {
  // place code for your default task here
});
