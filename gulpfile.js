var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();//  控制刷新的一个服务
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var reload = browserSync.reload; //  browsersync的
gulp.task('concat',function(){//   task  执行一个任务  pipe  管道
  gulp.src(['js/script1.js','js/script2.js'])
      .pipe(concat('concat.js'))
      .pipe(gulp.dest('compress/'))//  输出文件
})
//  静态服务器
gulp.task('server',['sass'],function(){
  browserSync.init({
    server:'./'
  });
  gulp.watch('index.html').on('change',reload);
  gulp.watch('css/*.scss',['sass']);//  监听文件
})
gulp.task('sass',function(){
  gulp.src('./css/style.scss')
      .pipe(sass())
      .pipe(gulp.dest('css/'))
      .pipe(reload({stream:true}))
})
gulp.task('minifyjs',function(){
  gulp.src('compress/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('mijs'))
})
