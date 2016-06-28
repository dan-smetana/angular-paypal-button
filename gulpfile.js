var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src(['src/checkout.js', 'src/paypal-button.js'])
        .pipe(concat('paypal-button.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('paypal-button.min.js'))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(gulp.dest('./dist'));
})
