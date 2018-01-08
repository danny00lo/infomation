//编写于20170417*DannyLo
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    // htmlmin = require('gulp-htmlmin'),
    obfuscate = require('gulp-obfuscate'),
    notify = require('gulp-notify');


var dest = 'dist';


gulp.task('css', function () {
    return gulp.src('src/css/*.css') //压缩的文件
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest('dist/static')); //输出文件夹
});

gulp.task('default', function () {
    return gulp.src('src/js/*.js')
        .pipe(obfuscate())
        .pipe(gulp.dest('dist/static'));  //输出
});

gulp.task('js', function () {
    return gulp.src('src/js/*.js')
        //.pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulp.dest('dist/static'));  //输出
});

gulp.task('tpl', function () {
    return gulp.src('src/*.html')
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'html task ok' }));
});

gulp.task('lib', function () {
    return gulp.src('src/lib/*.js')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('imagemin:dev', function(){
    return gulp.src('src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'))
        .pipe(notify({ message: 'img task ok' }));
});


gulp.task('css:dev', function () {
    return gulp.src('src/css/*.css') //压缩的文件
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest('dist/static'))  //输出文件夹
        .pipe(reload({stream: true}));
});

gulp.task('js:dev', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        // .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/static'))  //输出
        .pipe(reload({stream: true}));
});

gulp.task('tpl:dev', function () {
    return gulp.src('src/*.html')
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'html task ok' }))
        .pipe(reload({stream: true}));
});

gulp.task('lib:dev', function () {
    return gulp.src('src/lib/*.js')
        .pipe(gulp.dest('dist/lib'));
})

gulp.task('dev', ['js:dev', 'css:dev', 'tpl:dev','lib:dev','imagemin:dev'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false
    });
    gulp.watch('src/js/*.js', ['js:dev']);
    gulp.watch('src/css/*.css', ['css:dev']);
    gulp.watch('src/*.html', ['tpl:dev']);
    gulp.watch('src/lib/*js',['lib:dev']);
    gulp.watch('src/images/**',['imagemin:dev'])
});

gulp.task('build', ['css', 'js', 'tpl','lib']);

gulp.task('clean', function () {
    return del([dest]);
});