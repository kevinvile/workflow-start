var gulp = require('gulp');
var karma = require('karma').server;
var tinylr = require('tiny-lr');
var scss = require('gulp-sass');
var sass = require('gulp-ruby-sass');

var expressConfig = {
	port: 4000,
	root: __dirname+'/public'
};

var tinylrPort = 35729;
var lr;

function startExpress() {
	console.log('starting express server at port: ' + expressConfig.port);
	var express = require('express');
	var app = express();
	//app.use(tinylr.middleware({app:app}));
	app.use(express.static(expressConfig.root));
	app.listen(expressConfig.port);
	
}

function startLivereload() { 
  lr = tinylr();
  lr.listen(tinylrPort);
}

function notifyLivereload(event) {
  console.log('notifying live reload', event);
  //lr.changed()
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(expressConfig.root, event.path);
 
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

function buildScss(gulp) {
	console.log('runnign scss');
	var stream = gulp.src('./src/**/*.scss').pipe(scss());

	stream.on('error', function(error) {
		console.log('Error In Scss', error);
	});
	
	stream.pipe(gulp.dest('./src'));
}

function buildSass(gulp) {
	console.log('runnign sass');
	return sass('./src/css/main.sass')

		.on('error', function(error) {
			console.log('Error In Sass', error);
		})
		.pipe(gulp.dest('./src/css'));
}

function autoPrefix(gulp) {
	var postcss      = require('gulp-postcss');
	var sourcemaps   = require('gulp-sourcemaps');
	var autoprefixer = require('autoprefixer-core');
	
	return gulp.src('./src/**/*.css')
	   .pipe(sourcemaps.init())
	   .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
	   .on('error', function(error) {
		   console.log('error in autoprefixing', error);
	   })
	   .pipe(sourcemaps.write('.'))
	   .pipe(gulp.dest('./public'));
}

gulp.task('sass', function() {
	return buildSass(gulp);
});

gulp.task('scss', function() {
	return buildScss(gulp);
});


gulp.task('default', function() {
	return startExpress();
});

gulp.task('moveHTML', function() {
	console.log('moving html');
	return gulp.src('./src/**/*.html')
		.pipe(gulp.dest('./public'));
});

gulp.task('autoprefixer', function() {
	return autoPrefix(gulp);
});

gulp.task('design.build',['sass', 'scss', 'moveHTML', 'autoprefixer'])

gulp.task('design.watch', ['design.build'], function(done) {
	startExpress();
	startLivereload();
	gulp.watch('./src/**/*.sass', ['sass']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.css', ['autoprefixer']);
	gulp.watch('./src/**/*.html', ['moveHTML']);
	gulp.watch('./public/**/*.*', notifyLivereload);
	
	karma.start({
	    configFile: __dirname + '/test/karma.conf.js'
	  }, done);
});


gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('develop.watch', function (done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js'
  }, done);
});