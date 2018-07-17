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

个人觉得, `dev`与`dev:play分别是网站开发和组件开发两种`.他们使用的都是webpack构建工具,配置文件都是webpack.demo.js.不同的是,官网开发构建了网页模板,而组件开发定义了`PLAY_ENV=true`环境变量.

由于webpack配置文件较多,我们只介绍利用环境变量解耦的部分,其余的就不过多介绍了.

```js
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isPlay = !!process.env.PLAY_ENV;

// 可以看到play模式与普通开发模式入口文件不同
entry: isProd ? {
    docs: './examples/entry.js',
    'element-ui': './src/index.js'
  } : (isPlay ? './examples/play.js' : './examples/entry.js'),

...
```

我们根据入口文件再稍作分析

先是play模式下的入口文件,可以看到仅仅引用了element所有的文件与样式,我们写的组件直接在index.vue中调用调试就可以了.

```js
import Vue from 'vue';
import Element from 'main/index.js';
import App from './play/index.vue';
import 'packages/theme-chalk/src/index.scss';

Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');

// index.vue
<template>
  <div style="margin: 20px;">
  </div>
</template>
<script>
  export default {
  };
</script>
```

而官网的的入口东西也一目了然,引用了一些layout的组件,以及切换标题的路由的钩子.

```js
import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
import Element from 'main/index.js';
import 'packages/theme-chalk/src/index.scss';
import routes from './route.config';
import demoBlock from './components/demo-block.vue';
import MainFooter from './components/footer.vue';
import MainHeader from './components/header.vue';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
import title from './i18n/title.json';

Vue.use(Element);
Vue.use(VueRouter);
Vue.component('demo-block', demoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Element';
});

new Vue({ // eslint-disable-line
  render: h => h(entry),
  router
}).$mount('#app');

```



#### 组合

那么我们如何将组件,教程和网页组合在一起呢?element团队开发了[vue-markdown-loader](https://www.npmjs.com/package/vue-marked-loader),通过在md文件中编写Vue组件,然后在Vue中直接加载来达到目的.

下文是我专门写的基于element框架中加载markdown的方案写的教程.如果有兴趣可以了解一下.

#### 总结

那么到这里的话,正常开发组件已经没有问题了,其中有一些细节,相信各位处理的肯定比我好.关于部署和发布会在后续继续更新.

最后感谢您的阅读!

感谢element团队的贡献!

