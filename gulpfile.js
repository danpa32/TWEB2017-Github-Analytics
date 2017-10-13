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

gulp.task('scripts', () => gulp.src('src/**/*.js', { base: 'src' })
  .pipe(plugins.plumber())
  .pipe(plugins.if(dev, plugins.sourcemaps.init()))
  .pipe(plugins.babel())
  .pipe(plugins.if(dev, plugins.sourcemaps.write('.')))
  .pipe(gulp.dest('dist')));

gulp.task('publish', () => {
  runSequence(['lint', 'lint:test'], ['tests'], ['scripts']);
});

gulp.task('deploy', ['publish'], () => gulp.src(['dist/**/*.js', 'package.json'])
  .pipe(plugins.git.add())
  .pipe(plugins.git.commit(`Deploy of ${new Date()}`))
  .pipe(plugins.git.push('heroku', 'master')));

gulp.task('clean', () => gulp.src('dist', { read: false })
  .pipe(plugins.clean()));
