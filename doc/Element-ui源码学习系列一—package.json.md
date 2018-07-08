# Element-ui源码学习系列一—package.json

**在阅读源码前,过一遍package.json是非常有必要的..package.json描述了项目名称、版本号、所依赖的npm包以及生命周期等.**

### 1.依赖关系

话不多说,下面是源码中的package.json基本信息和依赖关系:

```json
{
  "name": "element-ui",  #项目名称
  "version": "2.4.3",  #项目版本号
  "description": "A Component Library for Vue.js.",  #项目描述
  "main": "lib/element-ui.common.js",  #当使用require('module')时返回的主文件
  "files": [ #模块下的文件名或者是文件夹名,如果是文件夹,则文件夹下所有文件也会被包含(除非文件被另一些配置排除)
    "lib",
    "src",
    "packages",
    "types"
  ],
  "typings": "types/index.d.ts",
  "faas": {
    "domain": "element",
    "public": "temp_web/element"
  },
  "repository": {  #git仓库地址
    "type": "git",
    "url": "git@github.com:ElemeFE/element.git"
  },
  "homepage": "http://element.eleme.io",  #通过gh-pages发布到github的主页地址
  "keywords": [  #npm搜索时的关键词
    "eleme",
    "vue",
    "components"
  ],
  "license": "MIT",  #MIT开源协议
  "bugs": {
    "url": "https://github.com/ElemeFE/element/issues"  #BUG提交邮箱
  },
  "unpkg": "lib/index.js",
  "style": "lib/theme-chalk/index.css",
  "dependencies": {
    "async-validator": "~1.8.1",  #异步数据验证插件
    "babel-helper-vue-jsx-merge-props": "^2.0.0",  #jsx和vue合并插件
    "deepmerge": "^1.2.0",  #对象深度合并插件
    "normalize-wheel": "^1.0.1",  #浏览器滚轮兼容插件
    "resize-observer-polyfill": "^1.5.0",  #监听元素变化插件
    "throttle-debounce": "^1.0.1"  #节流去抖插件
  },
  "peerDependencies": {  #宿主依赖包
    "vue": "^2.5.2"
  },
  "devDependencies": {
    "algoliasearch": "^3.24.5",  #实时托管全文搜索引擎
    "babel-cli": "^6.14.0",  #babel系列
    "babel-core": "^6.14.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-syntax-jsx": "^6.8.0",
    "babel-plugin-transform-vue-jsx": "^3.3.0",
    "babel-preset-es2015": "^6.14.0",
    "chai": "^3.5.0",  #断言插件
    "cheerio": "^0.18.0",  #服务器高效操作DOM插件
    "chokidar": "^1.7.0",  #node检查文件变化插件
    "copy-webpack-plugin": "^4.1.1",  #webpack拷贝文件插件
    "coveralls": "^2.11.14",  #测试覆盖率插件
    "cp-cli": "^1.0.2",  #node中使用UNIX的cp命令插件
    "cross-env": "^3.1.3",  #跨平台地设置及使用环境变量
    "css-loader": "^0.28.7",  #css加载插件
    "es6-promise": "^4.0.5",  #promise语法插件
    "eslint": "4.14.0",  #eslint系列
    "eslint-config-elemefe": "0.1.1",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
    "extract-text-webpack-plugin": "^3.0.1",  #webpack中提取css样式成单独文件的插件
    "file-loader": "^1.1.5",  #文件加载插件
    "file-save": "^0.2.0",  #文件保存插件
    "gh-pages": "^0.11.0",  #自动发布到gh-pages
    "gulp": "^3.9.1",  #gulp打包系列
    "gulp-autoprefixer": "^4.0.0",
    "gulp-cssmin": "^0.1.7",
    "gulp-postcss": "^6.1.1",
    "gulp-sass": "^3.1.0",
    "highlight.js": "^9.3.0",  #高亮插件
    "html-loader": "^0.5.1",  #html加载器
    "html-webpack-plugin": "^2.30.1",  #webpack的HTML生成插件
    "inject-loader": "^3.0.1",
    "isparta-loader": "^2.0.0",
    "json-loader": "^0.5.7",  #json加载器
    "json-templater": "^1.0.4",  #json模板语法插件
    "karma": "^1.3.0",  #karma测试框架系列
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.2.0",
    "karma-sinon-chai": "^1.2.4",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "0.0.26",
    "karma-webpack": "^3.0.0",
    "lolex": "^1.5.1",  #时间模拟插件
    "markdown-it": "^6.1.1",  #markdown解析器
    "markdown-it-anchor": "^2.5.0",
    "markdown-it-container": "^2.0.0",
    "mocha": "^3.1.1",  #mocha测试库
    "node-sass": "^4.5.3",  #sass语法必备插件
    "perspective.js": "^1.0.0",  #透视插件
    "postcss": "^5.1.2",  #postcss系列
    "postcss-loader": "0.11.1",
    "postcss-salad": "^1.0.8",
    "progress-bar-webpack-plugin": "^1.11.0",
    "rimraf": "^2.5.4",  #node深度删除模块
    "sass-loader": "^6.0.6",  #sass加载器
    "sinon": "^1.17.6",  #sinon测试插件
    "sinon-chai": "^2.8.0",
    "style-loader": "^0.19.0",  #样式加载器
    "transliteration": "^1.1.11",
    "uppercamelcase": "^1.1.0",  #驼峰命名插件
    "url-loader": "^0.6.2",  #url加载器
    "vue": "^2.5.2",  #vue系列
    "vue-loader": "^13.3.0",
    "vue-markdown-loader": "1",
    "vue-router": "2.7.0",
    "vue-template-compiler": "^2.5.2",
    "vue-template-es2015-compiler": "^1.6.0",
    "webpack": "^3.7.1",  #webpack系列
    "webpack-dev-server": "^2.9.1",
    "webpack-node-externals": "^1.6.0"
  }
}
```

### 2.Scripts对象

在明确整个项目的依赖关系之后,package.json中scripts对象是下一步需要学习的部分.

`如果说package.json是学习框架的第一部分,那么其中scripts对象则是重中之重.script里边指定了项目的生命周期个各个环节需要执行的命令,体现了项目的开发、测试、打包、部署等架构关系.`

其中scripts对象的key是生命周期中的事件,而value是要执行的shell命令.

下面让我们来看看每条命令时做什么的,看完后也会对之后的学习方向有所清晰.

```json
"scripts": {
    "bootstrap": "yarn || npm i",
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
    "build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
    "build:umd": "node build/bin/build-locale.js",
    "clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
    "deploy": "npm run deploy:build && gh-pages -d examples/element-ui --remote eleme && rimraf examples/element-ui",
    "deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "i18n": "node build/bin/i18n.js",
    "lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
    "pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh",
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run",
    "test:watch": "npm run build:theme && karma start test/unit/karma.conf.js"
  }
```

整个scripts声明周期大致分为如下几个部分:

**1.安装依赖**

第一步,使用yran或者npm 安装项目依赖,当没有安装yran时会执行npm进行安装

```shell
"bootstrap": "yarn || npm i"
```

**2.编译打包**

```json
"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"

"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk"

"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js"

"build:umd": "node build/bin/build-locale.js"

"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage"
```

**3.开发模式**

```json
"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js"

"dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js"
```

**4.国际化**

```json
"i18n": "node build/bin/i18n.js",
```

**5.语法检查及测试**

```json
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet"

"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run"

"test:watch": "npm run build:theme && karma start test/unit/karma.conf.js"
```

**6.部署发布**

```json
"deploy": "npm run deploy:build && gh-pages -d examples/element-ui --remote eleme && rimraf examples/element-ui"

"deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME"

"pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh"
```

