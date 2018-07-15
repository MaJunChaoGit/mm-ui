# Element-ui源码学习系列二——搭建ESlint语法检测及Karma测试环境

​	先介绍下背景,这件事发生在我们团队的开发过程中,这件事也是我们团队为什么要坚定不移使用Eslint的导火索.事情是这样,项目在稳定版本后进行分支继续开发,新人同事无意中将一个Web Worker文件里的半角`)`改成了圆角`）`,Webpack编译一直报错并无法定位到错误,只能一片一片代码去注释来定位错误,而修复这个问题他至少耽误了1个小时。

​	客观的来说,这虽然是他个人粗心的问题,但谁又能保证自己不犯错呢?但是,随着团队人员的加入,代码量的递增,那么维护的成本将会越来越高,这时候,语法检测和单元测试的引入绝对是开发过程中的一大助力。

​	话不多说,下面让我们来看看Element-ui的语法检测与测试环境



---

[TOC]

### ESlint语法检测



##### [ESlint](http://eslint.cn/)有三种方式配置:

​	*1.package.json中eslintConfig字段*

​	*2.项目根目录的.eslintrc文件*

​	*3.命令行配置文件*

​	这里我们使用的第二种方式实现,并且也继承element-ui团队的规范。`项目根目录新建.eslintrc文件`,代码如下：

```json
# .eslintrc文件
{
	"env": {
	  "mocha": true # 添加所有的Mocha测试全局变量
	},
	"globals": {
      "expect": true, # 允许以下两个全局变量被重写
      "sinon": true
	},
	"plugins": ["html", "json"], # 使用"eslint-plugin-html"和"eslint-plugin-json"两个插件
	"extends": "elemefe", # 继承”eslint-config-elemefe“ 可以省略掉eslint-config-部分
	"rules": { 
	  "no-restricted-globals": ["error", "event", "fdescribe"] # 禁用特定的全局变量
	},
	"parserOptions": {
	  "ecmaFeatures": { # 表示你想使用的额外的语言特性
	    "experimentalObjectRestSpread": true,
	    "jsx": true
	  }
	}
}
```

我们也可以添加.eslintignore文件来排除一些不需要进行语法检查的文件

```json
# .eslintignore文件

*.sh
node_modules
*.md
*.scss
*.woff
*.ttf
coverage
```



#####安装的ESlint依赖包

通过分析配置文件,我们可以得出至少需要如下依赖:

```json
 "devDependencies": {
	"eslint": "4.14.0",
    "eslint-config-elemefe": "0.1.1",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
  }
```

在安装完成依赖后,实际上ESlint环境已经搭建完成了。但是为了提高我们的效率还需要再做几件事。



##### 打开eslint-config-elemefe文件

为了以后语法检测可以更快的定位错误 ,我们还是看看写了什么吧。

```javascript
const rules = require('./rules'); // 引用规则文件

module.exports = { 
  'root': true,  // 默认情况,ESlint会在所有父级目录里寻找配置文件,一直到根目录,一旦发现 'root': true 时就会停止在父类寻找

  'env': {
    'browser': true, // 浏览器环境中的全局变量
    'node': true, // Node.js 全局变量和 Node.js 作用域。
    'amd': false, // 将 require() 和 define() 定义为像 amd 一样的全局变量
    'mocha': false, // 添加所有的 Mocha 测试全局变量
    'jasmine': false // 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量
  },

  'parserOptions': {
    ecmaVersion: 6, // 默认设置为3,5（默认）
    sourceType: 'module', // ECMAScript 模块
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    }
  },

  rules: rules // 引用规则文件
};
```

rules文件我们就不分析了,所有的[语法规则都在这里](http://eslint.cn/docs/rules/),需要研究的可以参照。



#####配置IDE的ESlint环境

由于每个用的IDE各不相同,我只简单的介绍一下Sublime Text 3下的ESlint插件,如果需要配置细节可自行搜索。

插件的话我常用的为`ESlint-Formatter`和`SublimeLinter`一个是修改,一个是提示。具体用法就不过多介绍了



#####小结

在完成以上配置后,当编写代码时出现定义的规则上的错误时,Sublime会有如下图一样的提示:

![1531376867800](C:\Users\ADMINI~1\AppData\Local\Temp\1531376867800.png)

那么,只需要使用`ESlint-Formatter`的快捷键`ctrl+shift+h`修复即可,如果不修复的问题的可以对应[语法规则](http://eslint.cn/docs/rules/)一一修改,在熟练掌握之后,相信代码质量绝对能有显著的提高的。



----



### Karma测试环境



*Karma是由Google团队开发的一套前端测试运行框架,它需要与mocha等测试框架共同使用。而根据所测试的不同语言以及拓展语言安装所对应的插件，最后通过Webpack构建工具的各种loader进行整合打包，最终生成测试覆盖率报告*



#####安装依赖包

```json
# package.json

"dependencies": {
    "normalize-wheel": "^1.0.1"
  },
  "peerDependencies": {
    "vue": "^2.5.2"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5", 
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-module-resolver": "^3.1.1",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-es2015": "^6.24.1",
    "chai": "^4.1.2",
    "cross-env": "^5.2.0",
    "css-loader": "^1.0.0",
    "html-loader": "^0.5.5",
    "isparta-loader": "^2.0.0",
    "json-loader": "^0.5.7",
    "karma": "^2.0.4",
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.2",
    "karma-mocha": "^1.3.0",
    "karma-sinon-chai": "^2.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "0.0.32",
    "karma-webpack": "^3.0.0",
    "mocha": "^5.2.0",
    "postcss-loader": "^2.1.6",
    "progress-bar-webpack-plugin": "^1.11.0",
    "sinon": "^6.1.3",
    "sinon-chai": "^3.2.0",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "vue": "^2.5.2",
    "vue-loader": "^13.3.0",
    "vue-router": "2.7.0",
    "vue-template-compiler": "^2.5.2",
    "vue-template-es2015-compiler": "^1.6.0",
    "webpack": "^3.7.1", # 注意这里使用webpack版本
  }
```



#####项目结构

```js
element-ui
	├── build 	//编译配置文件
	├── node_modules 
	├── packages // 组件源码目录
	├── src 	// 国际化等源码目录
	├── tset 	// 测试目录
		├── util
			├── specs
	├── package.json
	├── .eslintrc
	├── .babelrc
	├── .eslintignore
	├── package-lock.json
	├── .gitignore
```



#####编写babel配置文件

不得不说,ES6的语法糖用起来确实很舒服,而babel的配置又非常简单，babel不火都难！

```json
{
  "presets": [["es2015", { "loose": true }]], # ES6 loose模式
  "plugins": ["transform-vue-jsx"], # vue支持jsx语法
}
```



##### 编写webpack配置文件

karma支持直接引入webpack配置文件，为了后续更好的修改，我们将webpack.test.js建立在build根目录下。

之后在根目录下建立config.js文件

```js
// config.js

var path = require('path');

// 路径别名导出
exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'element-ui': path.resolve(__dirname, '../')
};
// 不进行测试的文件与路径
exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;

```



```js
// webpack.test.js

const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // webpack进度条插件

const config = require('./config');  // 引入config.js

const webpackConfig = {
  entry: {
    app: ['./src/index.js'] // 入口文件
  },
  output: {
    path: path.resolve(process.cwd(), './dist'), // 输入文件路径
    publicPath: '/dist/',  // 图片、svg等资源开发路径转为输出路径设置
    filename: '[name].js', // 对应entry的键名
    chunkFilename: '[id].js'
  },
  resolve: {
    // 自动解析扩展省略后缀 import File from '../path/to/file'
    extensions: ['.js', '.vue', '.json'], 
    alias: Object.assign(config.alias, {
      'vue$': 'vue/dist/vue.common.js'
    }),
    modules: ['node_modules']
  },
  devtool: '#inline-source-map',
  module: {
    rules: [
      {
        enforce: 'post', // 首先执行
        test: /\.jsx?$/,
        loader: 'isparta-loader', // Karma入口文件解析
        options: { esModules: true },
        exclude: config.jsexclude,
        include: /src|packages/
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: process.env.CI_ENV ? 'isparta-loader' : 'isparta-loader!eslint-loader'
          },
          preserveWhitespace: false
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minisize=false'
      },
      {
        test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
  ]
};

if (!process.env.CI_ENV) {
  webpackConfig.plugins.push(
    new ProgressBarPlugin()
  );
}

module.exports = webpackConfig;

```



#####编写Karma配置文件

`test => unit 下建立index.js和karma.conf.js`

首先是入口文件，参照[isparta-loader](https://www.npmjs.com/package/isparta-loader)

```js
// index.js
// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);

```

其次是karma的配置文件

```js
// karma.conf.js

var webpackConfig = require('../../build/webpack.test'); // 引入webpack配置文件

// 测试时不需要入口文件
delete webpackConfig.entry;

module.exports = function(config) {
  var configuration = {
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browser: ['Chrome'],
    frameworks: ['mocha', 'sinon-chai'], // 使用的测试框架
    reporters: ['spec', 'coverage'],
    files: ['./index.js'], // 入口文件
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig, // webpack配置文件
    webpackMiddleware: {
      noInfo: true // 不开启提示信息
    },
    coverageReporter: {
      dir: './coverage', // 覆盖率生成报告路径
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    client: {
      mocha: {
        timeout: 4000 // 测试超时时间限制
      }
    }
  };

  config.set(configuration);
};

```

#####编写需要测试的文件以及测试用例

`package下新建app.vue文件`

```vue
// app.vue
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title: '标题'
      };
    },
    mounted() {
      this.title = 'Hello World';
    },
    methods: {
      setMessage(msg) {
        this.message = msg;
      }
    }
  };
</script>
```

`test => unit => specs下建立app.spec.js`

```js
// app.spec.js
import Vue from 'vue';
import app from '../../../packages/app.vue';

describe('test app.vue', () => {
  it('组件加载后,title应该是Hello World', () => {
    let vm = new Vue(app).$mount();
    expect(vm.title).to.equal('Hello World');
  });
});

```

#####配置package.json的script命令

```json
"scripts": {
    "lint": "eslint test/**/* packages/**/* --quiet",
    "test": "npm run lint && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run",
    "test:watch": "karma start test/unit/karma.conf.js"
  },
```

#####总结

完成所有配置之后执行`npm run test`将开始测试，当编译通过后可以访问 http://127.0.0.1:9876 来查看测试情况，或者在`test => unit => coverage => icov-report =>index.html查看覆盖率报告`