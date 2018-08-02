### Element-ui源码学习系列三——build:theme

shell命令如下,我们还是一步一步来分析每个命令是发挥什么作用的

```json
"build:theme": 
"node build/bin/gen-cssfile && 
 gulp build --gulpfile packages/theme-chalk/gulpfile.js && 
 cp-cli packages/theme-chalk/lib lib/theme-chalk"
```

**1.自动生成css文件 node build/bin/gen-cssfile**

只看文件名gen-cssfile.js不难看出这个文件的主要目的,自动生成css文件.我们暂且不管生成的文件作用,只关注gen-cssfile整体思路,代码如下:

(1).获取组件名

```javascript
// 获取当前组件库的组件名
Components = Object.keys(Components);
```

(2).判断当前的样式环境,是SCSS还是CSS?

```javascript
// 获取当前环境,目前环境是SCSS
var isSCSS = theme !== 'theme-default';
```

(3).遍历组件名,拼接导入样式表的字符串

```javascript
// 遍历组件名
Components.forEach(function(key) {
  // 如果是'icon', 'option', 'option-group'的话,不拼接字符串
  if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
  // 拼SCSS文件名
  var fileName = key + (isSCSS ? '.scss' : '.css');
  // 拼当前组件的SCSS样式路径
  indexContent += '@import "./' + fileName + '";\n';
  // ../..package/ + theme-chalk/ + src/ + alert.scss
  var filePath = path.resolve(basepath, theme, 'src', fileName);
  // 如果不存在的话,创建遗漏的文件
  if (!fileExists(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
  }
});
```

(4).写入文件

```javascript
// 写入文件
fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
// index.scss
@import "./base.scss";
@import "./pagination.scss";
@import "./dialog.scss";
@import "./autocomplete.scss";
@import "./dropdown.scss";
@import "./dropdown-menu.scss";

...
```

**2.编译并打包SCSS文件 gulp build --gulpfile packages/theme-chalk/gulpfile.js**

使用gulp来打包SCSS确实非常方便,这里命令的作用主要是凭借[gulp](https://www.npmjs.com/package/gulp)的本体和[sass](https://www.npmjs.com/package/gulp-sass)、[autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)、[cssmin](https://www.npmjs.com/package/gulp-cssmin)插件

来对之前的SCSS样式进行编译.

(1)创建编译任务

```javascript
gulp.task('compile', function() {
  return gulp.src('./src/*.scss') // 获取./src目录下的所有scss文件
    .pipe(sass.sync())  // 编译所有sass文件
    .pipe(autoprefixer({ // 为编译后的css文件创建浏览器兼容前缀
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin()) // 压缩CSS
    .pipe(gulp.dest('./lib')); //生成目录
});
```

(2)拷贝字体

```javascript
gulp.task('copyfont', function() {
  return gulp.src('./src/fonts/**') // 拷贝./src/fonts下的所有文件
    .pipe(cssmin()) // 压缩CSS
    .pipe(gulp.dest('./lib/fonts')); //生成目录
});
```

**3.拷贝文件到最终发布版本目录 cp-cli packages/theme-chalk/lib lib/theme-chalk"**

这里承接上一部分的操作,将刚刚packages/theme-chalk/lib目录下生成所有文件拷贝到lib/theme-chalk目录下,

这样可以非常方便的让用户使用