var gulp = require('gulp'),
    del = require('del'),
    spawn = require('child_process').spawn,
    merge = require('event-stream').merge,
    $ = require('gulp-load-plugins')();

gulp.task('clean', function() {
    return del(['dist/*']);
});

gulp.task('lint', function() {
    return gulp.src(['src/js/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

gulp.task('move', function() {
    var files = [
            'src/manifest.json',
            'src/js/options.js',
            'src/html/options.html',
            'src/css/*'
        ];

    return merge(
        gulp.src(files, { "base" : "src" })
            .pipe(gulp.dest('dist/chrome')),
        gulp.src('icons/*.png')
            .pipe(gulp.dest('dist/chrome/icons'))
    );
});

gulp.task('js', function() {
    return gulp.src(['src/js/github-toc.js', 'src/js/utils.js'])
        .pipe($.jsHtmlInjectTmp())
        .pipe($.concat('github-toc.js'))
        .pipe(gulp.dest('dist/chrome/js'));
});

gulp.task('reload-chrome', function() {
    spawn('open', ['-a', 'Google Chrome', 'http://reload.extensions']);
})

gulp.task('build', ['lint', 'js', 'move']);
gulp.task('default', ['build']);
gulp.task('browser', ['build', 'reload-chrome']);

