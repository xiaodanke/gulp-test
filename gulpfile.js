var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var webserver = require("gulp-webserver");// 启动一个服务
var minify = require("gulp-minify-css");
var webpack = require("gulp-webpack");
var named = require("vinyl-named")//  引入named 模块  可以在管道中拿到一些文件的文件名
//   创建一个拷贝文件的任务
gulp.task("copy-index",function(){
  gulp.src("./index.html")
      .pipe(gulp.dest("./app"))
})
//   启动服务
gulp.task("webserver",function(){
  gulp.src("./") //  找服务的根目录
      .pipe(webserver({
        host:"localhost",
        port:3000,
        directoryListing:{
          enable:true,//显示根目录下面的所有目录
          path:"./"
        },
        livereload:true  //  文件保存后自动刷新
      }))
})
//   文件的一个合并
gulp.task('concat',function(){
  gulp.src(["./js/script1.js","./js/script2.js"])
      .pipe(concat("concat.js"))
      .pipe(uglify())
      .pipe(gulp.dest("./app/compress"))
})
//   文件的压缩
gulp.task("uglify",function(){
  gulp.src("./app/compress/concat.js")
      .pipe(uglify())
      .pipe(gulp.dest("./app/prd/concat"))
})
gulp.task("sass",function(){
    gulp.src("./css/style.scss")
        .pipe(sass().on("error",sass.logError))// 当编译错误的时候打印错误日志
        .pipe(minify())
        .pipe(gulp.dest("./app/style"))
})
gulp.task("watch",function(){
  gulp.watch("./index.html",["copy-index"])
  gulp.watch("./css/style.scss",["sass"])
  gulp.watch("./js/*.js",["packjs"])
})
//  jsfiles
gulp.task("packjs",function(){
    gulp.src("./js/script1.js")
        .pipe(named())
        .pipe(webpack({
          output:{
            filename:'[name].js'
          },
          modules:{
            loaders:[{
              test:/\.js$/,
              loader:"imports?define=>false"
            }]
          }
        }))
        .pipe(uglify().on("error",function(){console.log("\x07",e.lineNumber,e.message);return this.end()}))
        .pipe(gulp.dest("./app/script"))
})
//  gulp 本身是不支持js  模块化的，需要借助webpack  webpack 的核心就是模块化开发 webpack， 既支持commonjs 规范 ，有支持AMD规范、

gulp.task("default",["watch","webserver","concat","uglify","sass","packjs"]);
//  所有在数组中执行的任务 ，下次执行的时候输入 gulp 就可以了
