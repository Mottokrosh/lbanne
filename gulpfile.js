var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var del = require('del');
var postcss = require('gulp-postcss');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var htmlify = require('html-browserify');

// monkey-patch gulp.src to include plumber
var gulp_src = gulp.src;
gulp.src = function () {
	return gulp_src.apply(gulp, arguments)
		.pipe(plumber(function (error) {
			// Output an error message
			gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
			// emit the end event, to properly end the task
			this.emit('end');
		})
	);
};

//
// All file and folder paths
//

var path = {
	HTML: 'src/index.html',
	TO_COPY: ['src/*.{html,js,ico,xml,png,json}'],
	ENTRY_POINT_JS: './src/js/index.js',
	ENTRY_POINT_CSS: './src/css/app.css',
	CSS: './src/css/**/*.css',
	IMAGES: './src/img/**/*.{png,jpg,gif,svg}',
	FONTS: './src/css/fonts/*.{eot,svg,ttf,woff,woff2}',
	DEST_JS_BUNDLE: 'bundle.js',
	DEST_DIR: 'www'
};

//
// Clean distribution folder
//

gulp.task('clean', function (cb) {
	del([
		path.DEST_DIR + '/**/*'
	], cb);
});

//
// Any files that simply need copying
//

gulp.task('copy', function () {
	gulp.src(path.TO_COPY)
		.pipe(gulp.dest(path.DEST_DIR));
});

//
// CSS
//

gulp.task('css', function () {
	return gulp.src(path.ENTRY_POINT_CSS)
		.pipe(postcss([
			require('precss')(),
			require('autoprefixer')(),
			require('cssnano')()
		]))
		.pipe(gulp.dest(path.DEST_DIR + '/css'));
});

//
// Images
//

gulp.task('images', function () {
	return gulp.src(path.IMAGES)
		.pipe(imagemin())
		.pipe(gulp.dest(path.DEST_DIR + '/img'));
});

//
// Fonts
//

gulp.task('fonts', function () {
	return gulp.src(path.FONTS)
		.pipe(gulp.dest(path.DEST_DIR + '/fonts'));
});

//
// One-time build
//

gulp.task('build', ['copy', 'css', 'images', 'fonts'], function () {
	browserify({
		entries: [path.ENTRY_POINT_JS],
		transform: [htmlify],
	})
	.bundle()
	.pipe(source(path.DEST_JS_BUNDLE))
	.pipe(streamify(uglify(path.DEST_JS_BUNDLE)))
	.pipe(gulp.dest(path.DEST_DIR + '/js'));
});

//
// Like build, but with file watching
//

gulp.task('watch', ['copy', 'css', 'images', 'fonts'], function () {
	gulp.watch(path.HTML, ['copy']);
	gulp.watch(path.CSS, ['css']);
	gulp.watch(path.IMAGES, ['images']);
	gulp.watch(path.FONTS, ['fonts']);

	var watcher = watchify(browserify({
		entries: [path.ENTRY_POINT_JS],
		transform: [htmlify],
		debug: true,
		cache: {}, packageCache: {}, fullPaths: true
	}));

	return watcher.on('update', function () {
		watcher.bundle()
			.pipe(source(path.DEST_JS_BUNDLE))
			.pipe(gulp.dest(path.DEST_DIR + '/js'));
			console.log('=> JS bundle updated');
	})
	.bundle()
	.pipe(source(path.DEST_JS_BUNDLE))
	.pipe(gulp.dest(path.DEST_DIR));
});

//
// Default
//

gulp.task('default', ['watch']);

// .-~'`EOF`'~-.