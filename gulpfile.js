var gulp = require("gulp");
var gulpsync = require('gulp-sync')(gulp);
var less = require("gulp-less");
var connect = require("gulp-connect");
var notifier = require('node-notifier');
var notify = require("gulp-notify");
var imagemin = require('gulp-imagemin');
var nunjucksRender = require('gulp-nunjucks-render');
var rigger = require('gulp-rigger');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var base64 = require('gulp-base64');
var cleanCSS = require('gulp-clean-css');
var NpmImportPlugin = require("less-plugin-npm-import");
var npmImport = new NpmImportPlugin();
var pxtorem = require('postcss-pxtorem');

var path = {
	src: 'src/',
	destination: 'build/'
};

gulp.task('images', function() {
	return gulp.src(path.src + 'img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest(path.destination + 'img/'))
		.pipe(connect.reload());
});

gulp.task('fonts', function() {
	return gulp.src(path.src + 'fonts/**/*.*')
		.pipe(gulp.dest(path.destination + 'fonts/'));
});

gulp.task('favicons', function() {
	return gulp.src(path.src + 'favicons/**/*.*')
		.pipe(gulp.dest(path.destination));
});

gulp.task('connect', function() {
	connect.server({
		port: 3000,
		livereload: true,
		root: path.destination
	});
});

gulp.task('less', ['images'], function() {
	return gulp.src(path.src + 'css/main.less')
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [npmImport]
		}))
			.on('error', function(err){
				console.log(err);
				notifier.notify({
					'title': 'Error',
					'message': err.message
				});
				console.log(err.message);
				return false;
			})
		.pipe(base64({
				baseDir: path.destination,
				extensions: ['svg'],
				maxImageSize: 8 * 1024,
				deleteAfterEncoding: true,
		}))
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions']
			}),
			pxtorem({
				rootValue: 16,
				unitPrecision: 5,
				propList: ['*'],
				selectorBlackList: [],
				replace: true,
				mediaQuery: true,
				minPixelValue: 0
			})
		]))
		.pipe(cleanCSS({
			level: 1
		}))
		.pipe(rename('styles.css'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(path.destination + 'css/'))
		.pipe(connect.reload())
});

gulp.task('nunjucks', function() {
	return gulp.src(path.src + 'templates/*.+(twig)')
		.pipe(nunjucksRender({
			path: [path.src + 'templates']
		}))
		.on('error', function(err) {
			console.log(err);
			notifier.notify({
				'title': "Error",
				'message': err.message
			});
			return false;
		})
		.pipe(gulp.dest(path.destination))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	return gulp.src(path.src + 'scripts/app.js')
		.pipe(rigger())
		.on('error', function(err) {
			console.log(err);
			notifier.notify({
				'title': "Error",
				'message': err.message
			});
			return false;
		})
		.pipe(uglify())
		.on('error', function(err) {
			console.log(err);
			notifier.notify({
				'title': "Error",
				'message': err.message
			});
			return false;
		})
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(path.destination + 'scripts'))
		.pipe(connect.reload());
});

gulp.task('reload', function() {
	return gulp.src('css/main.less')
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	watch(path.src + 'templates/**/*.twig', function(event, cb) {
		gulp.start('nunjucks');
	});

	watch(path.src + 'scripts/**/*.js', function(event, cb) {
		gulp.start('js');
	});

	watch([path.src + 'img/**/*.*', path.src + 'css/**/*.less'], function(event, cb) {
		gulp.start('less');
	});
});

gulp.task('clean', function () {
	return gulp.src(path.destination, {read: false})
		.pipe(clean());
});

gulp.task('default', gulpsync.sync([
	'clean',
	[
		'less',
		'nunjucks',
		'js',
		'fonts',
		'favicons',
		'connect',
		'watch',
	]
]));

gulp.task('build', gulpsync.sync([
	'clean',
	[
		'less',
		'nunjucks',
		'js',
		'fonts',
		'favicons',
	]
]));