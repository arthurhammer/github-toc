var gulp = require('gulp');
var del = require('del');
var exec = require('child_process').exec;
var merge = require('event-stream').merge;
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

// TODO: Clean up

// ---- Main ----

gulp.task('build', function(cb) {
  runSequence('clean', 'chrome', 'safari', 'firefox', 'userscript', cb);
});

gulp.task('dist', ['build'], function(cb) {
  runSequence('chrome:dist', 'clean:chrome',
              'safari:dist', // 'clean:safari',
              'firefox:dist', 'clean:firefox', cb);
});

gulp.task('default', ['build'], function () {
  gulp.watch(['./src/**/*'], ['default']);
});

gulp.task('clean', clean('dist/*'));
gulp.task('clean:chrome', clean('dist/chrome'));
gulp.task('clean:safari', clean('dist/safari.safariextension'));
gulp.task('clean:firefox', clean('dist/firefox'));


// ---- Chrome ----

gulp.task('chrome', ['chrome:js'], function() {
  return merge(
    gulp.src(['src/chrome/manifest.json', 'src/style.css'])
      .pipe(gulp.dest('dist/chrome')),
    gulp.src('img/icons/*')
      .pipe(gulp.dest('dist/chrome/icons'))
  );
});

gulp.task('chrome:js', function() {
  return buildJS()
    .pipe(gulp.dest('dist/chrome'));
});

gulp.task('chrome:dist', function() {
  return gulp.src('dist/chrome/**/*')
    .pipe($.zip('chrome.zip'))
    .pipe(gulp.dest('dist'));
});


// ---- Safari ----

gulp.task('safari', ['safari:js'], function() {
  return merge(
    gulp.src(['src/safari/Info.plist', 'src/style.css'])
      .pipe(gulp.dest('dist/safari.safariextension')),
    gulp.src('img/icons/icon128.png')
      .pipe($.rename('Icon.png'))
      .pipe(gulp.dest('dist/safari.safariextension/'))
  );
});

gulp.task('safari:js', function() {
  return buildJS()
    .pipe(gulp.dest('dist/safari.safariextension'));
});

// Building Safari could be automated (seems more work than worth, though).
// See: - https://www.npmjs.com/package/xar-js
//      - http://developer.streak.com/2013/01/how-to-build-safari-extension-using.html
gulp.task('safari:dist', function() {
  console.log('\n\x1b[1;31mSafari Extension\u001b[0;39m');
  console.log('\nTo package the Safari extension for distribution:' +
              '\n\n\t- Open Extension Builder in Safari' +
              '\n\t- Add `dist/safari.safariextension` as an existing extension'+
              '\n\t- Build the package and save it to `dist`' +
              '\n\t- (Delete `dist/safari.safariextension`)' +
              '\n\nNote: This requires a (paid) Apple Developer Membership' +
              '\n');
  return gulp.src('src/safari/SafariUpdate.plist')
    .pipe(gulp.dest('dist'));
});


// ---- Firefox ----

gulp.task('firefox', ['firefox:js'], function() {
 return merge(
    gulp.src(['src/firefox/manifest.json', 'src/style.css'])
      .pipe(gulp.dest('dist/firefox')),
    gulp.src('img/icons/*')
      .pipe(gulp.dest('dist/firefox/icons'))
  );
});

gulp.task('firefox:js', function() {
  return buildJS()
    .pipe(gulp.dest('dist/firefox'));
});

gulp.task('firefox:dist', function (cb) {
  var cd = 'cd dist/firefox;';
  var build = '../../node_modules/web-ext/bin/web-ext build --artifacts-dir=.;';
  var mv = 'mv *.zip ../firefox.zip';
  exec(cd + build + mv, function (err) {
    cb(err);
  });
});


// ---- Userscript ----

gulp.task('userscript', function() {
  return buildJS(['src/userscript/userscript.js'])
    .pipe($.addSrc.prepend('src/userscript/header.js'))
    .pipe($.concat('github-toc.user.js'))
    .pipe(gulp.dest('dist'));
});


// ---- Helpers ----

function buildJS(additions) {
  return gulp.src('src/github-toc.js')
    .pipe($.addSrc.prepend(additions ? additions : []))
    .pipe($.addSrc.prepend('src/util.js'))
    .pipe($.addSrc.prepend('src/toc.js'))
    .pipe($.jsHtmlInjectTmp())
    .pipe($.concat('github-toc.js'))
    .pipe($.wrap('(function() {\n\n<%= contents %>\n})();'));
}

function clean(f) {
  return function() {
    del(f);
  };
}
