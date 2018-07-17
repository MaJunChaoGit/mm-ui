### Element源码系列——搭建开发环境



#### 序言

由于其中涉及的知识点比较多,为了尽可能写的更详细,将会有一些文章间的跳转.如有带来困扰,实在抱歉.

个人觉得在搭建之前,角色互换一下,设身处地的想一下如果让您做一个这样的产品应该怎么去开发? 

既然咱们开发的是一个UI框架,那么一个美观的教程网站肯定是必须的,并且网站至少要有展示效果+代码+API这种组合来呈现内容.

那么我们首先要解决的问题是分离开发网站与开发组件之间的耦合，让其同步开发，提升效率，之后再找到一种便捷的方式将它们组织到一起.最后将网站部署,组件库发布.



#### 前期准备

```json
# 编译icon文件,编译源码入口文件,编译i18n文件,编译版本信息文件
"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js"
# 官网开发模式
"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js"
# 组件开发模式
"dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js"
```

上述`dev`与`dev:play`两个命令中都先执行了`npm run build:file

这里`build:file`中的4个子命令的主要作用都类似于通过配置文件来生成文件的作用.

比如:`node build/bin/iconInit.js`是通过读取SCSS文件来生成目前可以使用icon列表,最后网页调用进行展示.

比如:`node build/bin/build-entry.js`是通过读取json文件中配置的组件库路径,最终生成一个入口文件,方便后期使用.

如果想要了解详情的话,可以跳转!!!!!



#### 解耦

