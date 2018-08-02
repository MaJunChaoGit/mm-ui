# Element-ui源码系列——初识框架



[TOC]



#### 序言

现在前端的技术越来越杂,也越来越细了,以至于每次看完文档都会有个错觉,就是自己差不多会了.真正去做项目的时候又是重复之前的步骤.

之前写Java的时候，会习惯性的看看源码，看完之后会对知识掌握的更牢靠，并且茅塞顿开的感觉简直妙不可言。再回想做前端的这段时间，确实时是自己浮躁了。

我挑选了element做为学习目标的目的有二：

​	**1.element是一款Vue的UI框架,它可以将我的CSS,JavaScript,Vue知识糅合在一起。**

​	**2.之前项目上实现的前端技术架构不太好,一直觉得自己眼界低了.希望通过学习可以将已有的架构重构,来让我们团队的兄弟可以工作的更舒服。**

文章会持续更新，感谢element团队,也感谢各位的阅读！



#### 目录结构

**个人觉得,对于不同级别的程序猿来说,他们在读项目的文件结构时所得出的信息绝对是不一样的.首先阅读目录结构绝对是简单了解一个项目最快捷的方法.**

一个项目中好的目录结构绝对是必不可少,下面我们先来看看element的[源码版](https://github.com/ElemeFE/element)和[发布版](https://www.npmjs.com/package/element-ui)的目录结构,以此入门

```json
// 源码开发包目录结构
element
	├──.github             	   // github的ISSUE等文件模板
	├── build 	               // webpack编译配置文件等
	├── examples               // 官方主页项目包
	├── lib                    // 打包后文件目录
	├── node_modules           // 模块依赖目录
	├── packages               // 组件的源码目录
		├── alert  		       // 具体组件源码包
			├── src            // Vue组件包
			├── index.js       // 入口文件
	├── src 			       // 源码目录
		├── directive          // 实现滚轮优化，鼠标点击优化
		├── locale             // i18n国际化
		├── mixins             // Vue混合器
		├── transition         // 样式过渡效果
		├── utils              // 工具类包
		├── index.js           // 源码入口文件
	├── test 	               // 测试目录
		├── unit               // 单元测试目录
			├── coverage       // 单元测试覆盖率包
			├── specs          // 测试用例源码包
			├── index.js       // 测试入口
			├── karma.conf.js  // karma配置文件
			├── utils.js       // 工具类
	├── types 	               // typescript文件包
	├── .babelrc               // babel配置文件
	├── .eslintignore          // eslint配置忽略文件
	├── .eslintrc              // eslint配置
	├── .gitignore             // git忽略文件
	├── .travis.yml            // 持续构建配置
	├── package.json           // npm包核心文件
	├── components.json        // 组件列表json
	├── yarm.lock              // yram版本控制文件
	├── package-lock.json      // npm包版本控制文件
	├── postcss.config.js      // postcss配置文件
```

再看了源码开发包后,我们再来看看打包后的项目,也就是咱们平时用的element-ui目录结构如何?这样做的好处是大致可以看出源码包的构建工具到底做了什么?

```json
// 发布版本包目录结构
element-ui
	├── lib                    // 打包后文件目录
	├── packages               // 组件的源码目录
		├── alert  		       // 具体组件源码包
			├── src            // Vue组件包
			├── index.js       // 入口文件
	├── src 			       // 源码目录
		├── directive          // 实现滚轮优化，鼠标点击优化
		├── locale             // i18n国际化
		├── mixins             // Vue混合器
		├── transition         // 样式过渡效果
		├── utils              // 工具类包
		├── index.js           // 源码入口文件
	├── types 	               // typescript文件包
	├── package.json           // npm包核心文件
```



#### package.json



**在阅读源码前,过一遍package.json是非常有必要的.package.json描述了项目名称、版本号、所依赖的npm包以及项目不同生命周期时构建工作的配置等,在读完之后你会对发现之前目录结构学习上一些模糊不清的文件慢慢漏出了真面目!.**

##### <u>1</u>.基础信息

通过package.json中的基础信息,可以让我们看出平时我们通过npm安装的入口文件是哪个,也可以看到unpkg引入时到底引入的是谁?

```json
{
  "name": "element-ui",  # 项目名称
  "version": "2.4.3",  # 项目版本号
  "description": "A Component Library for Vue.js.",  # 项目描述
  "main": "lib/element-ui.common.js",  # 当使用require('module')时返回的主文件
  # 模块下的文件名或者是文件夹名,如果是文件夹,则文件夹下所有文件也会被包含(除非文件被另一些配置排除)
  "files": [ 
    "lib",
    "src",
    "packages",
    "types"
  ],
  "typings": "types/index.d.ts", # typescript文件入口
  "faas": {
    "domain": "element",
    "public": "temp_web/element"
  },
  "repository": {  # git仓库地址
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
}
```



##### <u>2</u>.依赖关系

依赖关系可以让我们对大局上有些把握,至少让我们心里有点数,知道大概用了哪些技术,不然看到各种require之后一脸懵,反而会影响学习进度和思路.

依赖关系还有一个重要的是版本信息,尤其是webpack这些构建工具的版本,格外注意!

```json
{
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

##### <u>3</u>.Scripts对象

在明确整个项目的依赖关系之后,package.json中scripts对象是下一步需要学习的部分.

`如果说package.json是学习框架的第一部分,那么其中scripts对象则是重中之重.script里边指定了项目的生命周期个各个环节需要执行的命令,体现了项目的开发、测试、打包、部署等架构关系.`

其中scripts对象的key是生命周期中的事件,而value是要执行的shell命令.

下面让我们来看看每条命令时做什么的,看完后也会对之后的学习方向有所清晰.

**1.安装依赖**

第一步,使用yran或者npm 安装项目依赖,当没有安装yran时会执行npm进行安装

```shell
"bootstrap": "yarn || npm i"
```

**2.语法检查及karma测试**

第二步,搭建语法检查与karma测试环境.这里是关于这部分的详细介绍

```json
# 检查以下文件目录下的文件是否符合语法规则
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet"
# CI环境的单元测试,会启动浏览器
"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run"
# 仅单元测试
"test:watch": "npm run build:theme && karma start test/unit/karma.conf.js"
```

**3.搭建开发环境**

第三步,搭建开发环境.开发环境比较复杂,我也会单独提出一篇文章做介绍

```json
# 编译icon文件,编译源码入口文件,编译i18n文件,编译版本信息文件
"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"
# 官网开发模式
"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js"
# 组件开发模式
"dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js"
```

**4.部署发布**

最后,部署发布同样也会单独提出一篇文章做介绍

```json
# SCSS生成CSS并创建入口文件
"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk"
# 编译工具文件
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js"
# 编译umd风格国际化文件
"build:umd": "node build/bin/build-locale.js"
# 打包生成最终文件
"dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme"
# 清除生成的文件
"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage"
# 部署github页面
"deploy": "npm run deploy:build && gh-pages -d examples/element-ui --remote eleme && rimraf examples/element-ui"
# 部署并编译文件
"deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME"
# 发布版本
"pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh"
```



#### 总结

初识框架大致结束了,关于Script的命令后续文章也会进行介绍.个人觉得,如果要学习源码,从头开始了解别人的东西总是好的,这样可以与开发者站在同一角度思考问题,切勿浮躁上来就去写代码,写到最后会发现失去了很多,也错了很多.

感谢您的阅读!

最后再次感谢element团队带给大家的好框架!!

