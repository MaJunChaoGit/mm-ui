

# Element-ui源码学习系列五——build:umd

```json
"build:umd": "node build/bin/build-locale.js"
```

话不多说,先看build-locale.js自然就知道这个命令起到什么作用了

```javascript
// 文件中最核心的是transform这个方法了
var transform = function(filename, name, cb) {
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',// 对export default {} 支持更友好
      ['transform-es2015-modules-umd', {loose: true}]
    ],
    moduleId: name
  }, cb);
};
```

可以看到transform这个方法使用babel-core插件对文件进行umd转码,再结合shell命令可以得出该命令的作用为将国际化文件进行umd转码.

那么,transform在哪里被调用呢,请继续往下看

```javascript

fileList
  .filter(function(file) {
    return /\.js$/.test(file); // 过滤不是js的文件名
  })
  .forEach(function(file) {
    var name = basename(file, '.js'); // 获取文件名

    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code; // 获取文件内容

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code); // 写入文件

        console.log(file);
      }
    });
  });
```

**OK,那么整个命令的作用也呼之欲出了.就是将原来ES6的导出模块写法( export default {} )的国际化文件通过[add-module-exports](https://www.npmjs.com/package/babel-plugin-add-module-exports)和[transform-es2015-modules-umd](http://babeljs.io/docs/en/babel-plugin-transform-es2015-modules-umd/)两个babel插件以及正则替换转换为umd规范的文件,以便后续使用.**

下面是文件前后变化以及调用方式:

ES6写法的初始文件:

```javascript

export default { // 这里使用了export default {}
  el: {
    colorpicker: {
      confirm: 'OK',
      clear: 'Изчисти'
    },
  ...
```

通过babel转码后的文件:

```javascript
(function (global, factory) {  //umd的通用写法
  if (typeof define === "function" && define.amd) {
    define('af-ZA', ['module', 'exports'], factory); // 这里需要用正则进行路径替换才可以使用
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.afZA = mod.exports; // 这里需要挂载到ELEMENT.lang对象上以便后续使用
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;
  exports.default = {
    el: {
      colorpicker: {
        confirm: 'Bevestig',
        clear: 'Maak skoon'
      },
   ...
```

通过正则替换后的文件:

```javascript
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('element/locale/af-ZA', ['module', 'exports'], factory); // 更改了路径
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.ELEMENT.lang = global.ELEMENT.lang || {};  // 重新挂载了对象
    global.ELEMENT.lang.afZA = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;
  exports.default = {
    el: {
      colorpicker: {
        confirm: 'Bevestig',
        clear: 'Maak skoon'
      },
   ...
```

那么最后,我们需要知道umd规范的国际化文件何时使用呢?其实如果读过官方教程的话,答案就在这里[国际化教程](http://element.eleme.io/#/zh-CN/component/i18n)

**通过 CDN 的方式加载语言文件**

```html
<script src="//unpkg.com/element-ui/lib/umd/locale/en.js"></script>

<script>
  ELEMENT.locale(ELEMENT.lang.en)
</script>
```