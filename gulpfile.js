//Modules
var del = require('del'); //使用 del 取代原有的 gulp-clean.

//gulp.js plugin registry.
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var config = require('./config');


// Error Helper
function onError(err) {
  console.log(err);
}

// Server Task.
gulp.task('server', function() {
  plugins.connect.server({
    root: config.dist,
    livereload: true
  });
});

// Html Task.
gulp.task('html', function() {
  gulp.src(config.src.html + '*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(plugins.connect.reload());
});

// Script Task.
gulp.task('script', function() {
  gulp.src(config.src.script + '*.js')
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest(config.dist + 'js'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.dist + 'js'))
    .pipe(plugins.connect.reload());
});

// Styles Task.
gulp.task('sass', function() {
  gulp.src(config.src.style + 'main.scss')
    .pipe(plugins.sass.sync())
    .pipe(gulp.dest(config.dist + 'css/'))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.dist + 'css/'))
    .pipe(plugins.connect.reload());
});

// Watch Task.
gulp.task('watch', function() {
  gulp.watch(config.src.html + '*.html', ['html']);
  gulp.watch(config.src.script + '*.js', ['script']);
  gulp.watch(config.src.style + '*.scss', ['sass']);
}).on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type);
});

// Clean
gulp.task('clean', function(cb) {
  del([config.dist + '*.html', config.dist + 'css/**', config.dist + 'js/**', '!./app/css', '!./app/js'], cb)
    .then(function(paths) {
      console.log('Deleted files/folders:\n', paths.join('\n'));
    })
    .then(cb);
});

// Default Task.
gulp.task('default', ['clean'], function() {
  return gulp.start('html', 'sass', 'script', 'server', 'watch');
});

// Compile Task.
gulp.task('compile', ['clean'], function(cb) {
  return gulp.start('html', 'sass', 'script');
});

// Deploy Task.
gulp.task('deploy', function() {
  return gulp.src(config.dist + '**/*').pipe(plugins.ghPages());
});
