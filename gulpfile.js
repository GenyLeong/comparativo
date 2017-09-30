// generated on 2017-07-12 using generator-lntool 0.3.3

var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./gulp-tasks'),
runSequence = require('run-sequence')
;

var conf = require('./conf').conf;


// default task
gulp.task('default', ['server']);

gulp.task('build', function(cb) {

    runSequence(
        'clean_build',
        // 'browserify',
        ['build_js', 'sass'],
        ['js_vendor', 'js_all', 'minify-css', 'copy'],
        function(){
            console.log("El Build de la aplicación se creó en  ----> %s <---- ok!", conf.dest);
            cb();
        });
});
