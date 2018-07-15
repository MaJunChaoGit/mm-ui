# Element-ui源码学习系列四——build:utils

编译工具类命令主要涉及到.babelrc文件以及[babel](http://babeljs.io/)和[cross-env](https://www.npmjs.com/package/cross-env)两个插件，下面是编译命令：

```json
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
```

那么，在使用babel第一步肯定是编写.babelrc 文件，element的babel配置文件如下:

```json
{
  "presets": [["es2015", { "loose": true }]], #使用ES6的loose模式
  "plugins": ["transform-vue-jsx"], #转换vue中的jsx语法
  "env": { 
    "utils": { #当环境变量BABEL_ENV为utils时，使用"module-resolver"插件
      "plugins": [
        ["module-resolver", {
          "root": ["element-ui"], #设置根目录为element-ui
          "alias": { #设置路径别名
            "element-ui/src": "element-ui/lib"
          }
        }]
      ]
    }
  }
}
```

在文件中有趣的事当我们用cross-env设置BABEL_ENV为utils，这时babel来编译文件时变会使用[module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver)

插件。module-resolver的功能不详细介绍了，贴个npm包的使用介绍.

```javascript
// Use this:
import MyUtilFn from 'utils/MyUtilFn';
// Instead of that:
import MyUtilFn from '../../../../utils/MyUtilFn';
 
// And it also work with require calls
// Use this:
const MyUtilFn = require('utils/MyUtilFn');
// Instead of that:
const MyUtilFn = require('../../../../utils/MyUtilFn');
```

可以看到module-resolver插件提升了开发的效率，我们无需再写入../../这类的路径了。不过这里处理的方式更加巧妙一些，我们先看下，工具类中的路径

```js
// clickoutside.js
import { on } from 'element-ui/src/utils/dom';
// vdom.js
import { hasOwn } from 'element-ui/src/utils/util';
```

好的，让我们再回忆下最开始的命令:

```json
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
```

**这里巧妙的操作是在开发时，工具类的路径肯定没有问题。而在打包发布的时候，由于路径发生变化需要做一些改变的时候，只需要通过[babel](http://babeljs.io/)的[module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver)插件以及通过[cross-env](https://www.npmjs.com/package/cross-env)设置一个BABEL_ENV环境变量就可以完成转换了，非常的方便！**

