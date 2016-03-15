var gulp = require('gulp');
var del = require('del');
var run = require('child_process').exec;
var merge = require('event-stream').merge;
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();


// Main
gulp.task('build', function(cb) {
    runSequence('clean', 'chrome', 'firefox', 'userscript', cb);
});

gulp.task('dist', function(cb) {
    runSequence('build', 'chrome:dist', 'clean:chrome', 'firefox:dist', 'clean:firefox', cb);
});

gulp.task('default', ['build'], function () {
    gulp.watch(['./src/**/*'], ['default']);
});

gulp.task('clean', function() { return del(['dist/*']); });
gulp.task('clean:firefox', function() { return del(['dist/firefox']); });
gulp.task('clean:chrome', function() { return del(['dist/chrome']); });


// Chrome
gulp.task('chrome', ['chrome:js'], function() {
    var files = [
        'src/chrome/manifest.json',
        'src/chrome/preferences.js',
        'src/chrome/preferences.html',
        'src/style.css'
    ];

    return merge(
        gulp.src(files)
            .pipe(gulp.dest('dist/chrome')),
        gulp.src('img/icons/*')
            .pipe(gulp.dest('dist/chrome/icons'))
    );
});

gulp.task('chrome:js', function() {
    return buildJS('src/chrome/storage.js')
        .pipe(gulp.dest('dist/chrome'));
});

gulp.task('chrome:dist', function() {
    return gulp.src('dist/chrome/**/*')
        .pipe($.zip('chrome.zip'))
        .pipe(gulp.dest('dist'));
});


// Firefox
gulp.task('firefox', ['firefox:js'], function() {
    return merge(
        gulp.src(['src/firefox/index.js', 'src/firefox/package.json'])
            .pipe(gulp.dest('dist/firefox/')),
        gulp.src('img/icons/icon48.png')
            .pipe($.rename('icon.png'))
            .pipe(gulp.dest('dist/firefox/')),
        gulp.src('src/style.css')
            .pipe(gulp.dest('dist/firefox/data'))
    );
});

gulp.task('firefox:js', function() {
    return buildJS('src/firefox/storage.js').
        pipe(gulp.dest('dist/firefox/data'));
});

gulp.task('firefox:dist', function (cb) {
    run('cd dist/firefox; jpm xpi; mv *.xpi ../firefox.xpi', function (err, stdout, stderr) {
        console.log(stderr);
        cb(err);
    });
});


// Userscript
gulp.task('userscript', function() {
    return buildJS(['src/userscript/userscript.js'])
        .pipe($.addSrc.prepend('src/userscript/header.js'))
        .pipe($.concat('github-toc.user.js'))
        .pipe(gulp.dest('dist'));
});


// Helper
function buildJS(additions) {
    return gulp.src('src/github-toc.js')
        .pipe($.addSrc.prepend(additions))
        .pipe($.jsHtmlInjectTmp({pattern: /['']@@import ([a-zA-Z0-9\-_.\\/]+)['']/g}))
        .pipe($.concat('github-toc.js'))
        .pipe($.wrap('(function() {\n\n<%= contents %>\n})();'));
}
