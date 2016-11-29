var gulp = require('gulp');
var jade = require('gulp-jade');
var rename = require('rename');

gulp.task('html', function() {
	gulp.src('./views/*.pug')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('./public'))
});

gulp.task('watch', function() {
	gulp.watch('./views/*.pug', ['html']);
})