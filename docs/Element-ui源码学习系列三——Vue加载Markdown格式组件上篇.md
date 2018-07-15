### Element-ui源码学习系列三——Vue加载Markdown格式组件上篇



[TOC]

#### 序言

**文档是如何工作的 --** [vue-markdown-loader ](https://github.com/QingWei-Li/vue-markdown-loader)

> 当初写 [Mint UI](https://github.com/ElemeFE/mint-ui) 时就遇到了要用 Vue 写文档的问题：如何才能在写 Markdown 时也能写 Vue 组件的 Demo。虽然后来并没有在 Mint UI 的文档里写 Demo。最开始在 Element 的内部版本里，找遍了各种 Vue 的 Markdown 相关插件，要么是在 template 里定义 Markdown 格式，要么就是有一个 Markdown 的组件。都不能做到纯粹的写 Markdown 文件，并且还能写 Demo。
>
> 后来想到或许可以尝试把 Markdown 文件转成 Vue 组件。毕竟可以在 Markdown 里写 HTML，那么完全可以作为 Vue 的模板。后来就有了 vue-markdown-loader，一个把 Markdown 转成 Vue 组件的 webpack loader，搭配 vue-router 就能搭建一个可以在 Markdown 里写 Vue 代码的文档网站。
>
> 引用自—https://segmentfault.com/a/1190000007026819



**在写之前,我们先整理下需求,只有理解了需求才可以生产出更好的代码!这也是本文中最重要的部分.**

**我们的目的是做一个这样的教程网站. http://element.eleme.io/#/zh-CN/component/alert**

**为了提升开发效率,我们需要将markdown格式的文件可以通过 import md from 'path/xx.md'的导入形式加载到相对应组件中,这时markdown文件就是一个组件.**

**那么我们第一个需求就是拦截import,并且解析markdowm语法!**

**到这里时,看似没有啥毛病.但是别忘了我们要做的是教程网站. 光有代码可不行,我们还需要有效果呀!**

**所以我们第二个需求就是在析markdown中也可以写Vue的组件!**

**解决了这个问题后,我们只要对设计好网页的模板,并通过路由调用不同的md文件就可以生成好一套教程网站了**



----



 

#### 安装vue-cli

方便起见,我们就不再自己搭建环境了,直接进入主题.

```shell
vue init webpack markdown
cd markdown
npm install
```



####安装相关依赖

```
markdown-it 渲染 markdown 基本语法
markdown-it-anchor 为各级标题添加锚点
markdown-it-container 用于创建自定义的块级容器
vue-markdown-loader 核心loader
transliteration 中文转拼音
cheerio 服务器版jQuery
highlight.js 代码块高亮实现
striptags 利用cheerio实现两个方法,strip是去除标签以及内容，fetch是获取第一符合规则的标签的内容
```



####编写Webpack配置文件

先在`build`目录下新建一个`strip-tags.js`文件.

```js
// strip-tags.js

'use strict';

var cheerio = require('cheerio'); // 服务器版的jQuery

/**
 * 在生成组件效果展示时,解析出的VUE组件有些是带<script>和<style>的,我们需要先将其剔除,之后使用
 * @param  {[String]}       str   需要剔除的标签名 e.g'script'或['script','style']
 * @param  {[Array|String]} tags  e.g '<template></template><script></script>''
 * @return {[String]}             e.g '<html><head><template></template></head><body></body></html>'
 */
exports.strip = function(str, tags) {
  var $ = cheerio.load(str, {decodeEntities: false});

  if (!tags || tags.length === 0) {
    return str;
  }

  tags = !Array.isArray(tags) ? [tags] : tags;
  var len = tags.length;

  while (len--) {
    $(tags[len]).remove();
  }

  return $.html(); // cheerio 转换后会将代码放入<head>中
};

/**
 * 获取标签中的文本内容
 * @param  {[String]} str e.g '<html><body><h1>header</h1></body><script></script></html>'
 * @param  {[String]} tag e.g 'h1'
 * @return {[String]}     e.g 'header'
 */
exports.fetch = function(str, tag) {
  var $ = cheerio.load(str, {decodeEntities: false});
  if (!tag) return str;

  return $(tag).html();
};
```



工具类写完后,我们就开始配置webpack吧,打开`webpack.base.conf.js`

```js
// webpack.base.conf.js

const md = require('markdown-it')(); // 引入markdown-it
const slugify = require('transliteration').slugify; // 引入transliteration中的slugify方法

const striptags = require('./strip-tags'); // 引入刚刚的工具类

/**
 * 由于cheerio在转换汉字时会出现转为Unicode的情况,所以我们编写convert方法来保证最终转码正确
 * @param  {[String]} str e.g  &#x6210;&#x529F;
 * @return {[String]}     e.g  成功
 */
function convert(str) {
  str = str.replace(/(&#x)(\w{4});/gi, function($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
  });
  return str;
}

/**
 * 由于v-pre会导致在加载时直接按内容生成页面.但是我们想要的是直接展示组件效果,通过正则进行替换
 * hljs是highlight.js中的高亮样式类名
 * @param  {[type]} render e.g '<code v-pre class="test"></code>' | '<code></code>'
 * @return {[type]}        e.g '<code class="hljs test></code>'   | '<code class="hljs></code>'
 */
function wrap(render) {
  return function() {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
}
```



在module .rules中添加一个新的loader,

```js
{
        test: /\.md$/,
        loader: 'vue-markdown-loader',
        options: {
          use: [
            [require('markdown-it-anchor'), {
              level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
              slugify: slugify, // 自定义slugify, 我们使用的是将中文转为汉语拼音,最终生成为标题id属性
              permalink: true, // 开启标题锚点功能
              permalinkBefore: true // 在标题前创建锚点
            }],
            // 'markdown-it-container'的作用是自定义代码块
            
            [require('markdown-it-container'), 'demo', {
              // 当我们写::: demo :::这样的语法时才会进入自定义渲染方法
              validate: function(params) {
                return params.trim().match(/^demo\s*(.*)$/);
              },
			 // 自定义渲染方法,这里为核心代码
              render: function(tokens, idx) {
                var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                // nesting === 1表示标签开始
                if (tokens[idx].nesting === 1) {
                  // 获取正则捕获组中的描述内容,即::: demo xxx中的xxx
                  var description = (m && m.length > 1) ? m[1] : '';
                  // 获得内容
                  var content = tokens[idx + 1].content;
                  // 解析过滤解码生成html字符串
                  var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1');
                  // 获取script中的内容
                  var script = striptags.fetch(content, 'script');
                  // 获取style中的内容
                  var style = striptags.fetch(content, 'style');
                  // 组合成prop参数,准备传入组件
                  var jsfiddle = { html: html, script: script, style: style };
                  // 是否有描述需要渲染
                  var descriptionHTML = description
                    ? md.render(description)
                    : '';
                  // 将jsfiddle对象转换为字符串,并将特殊字符转为转义序列
                  jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));
				  // 起始标签,写入demo-block模板开头,并传入参数
                  return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                            <div class="source" slot="source">${html}</div>
                            ${descriptionHTML}
                            <div class="highlight" slot="highlight">`;
                }
                // 否则闭合标签
                return '</div></demo-block>\n';
              }
            }],
            [require('markdown-it-container'), 'tip'],
            [require('markdown-it-container'), 'warning']
          ],
          // 定义处理规则
          preprocess: function(MarkdownIt, source) {
            // 对于markdown中的table,
            MarkdownIt.renderer.rules.table_open = function() {
              return '<table class="table">';
            };
            // 对于代码块去除v-pre,添加高亮样式
            MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
            return source;
          }
        }
},
```



#### 编写组件

根目录下新建一个info.md文件用以测试

```markdown
//info.md
### 基本用法

页面中的非浮层元素，不会自动消失。

:::demo Alert 组件提供四种主题，由`type`属性指定，默认值为`info`。
​```html
<template>
  <el-alert
    title="成功提示的文案"
    type="success">
  </el-alert>
  <el-alert
    title="消息提示的文案"
    type="info">
  </el-alert>
  <el-alert
    title="警告提示的文案"
    type="warning">
  </el-alert>
  <el-alerty
    title="错误提示的文案"
    type="error">
  </el-alert>
</template>
​```
:::

```

在components中的HelloWorld.vue中引入md文件

```vue
// HelloWorld.vue
<template>
  <div class="hello">
    <info></info>
  </div>
</template>

<script type="text/babel">
import info from '../../info.md'; // 导入md文件
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    info // 注册组件
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import 'highlight.js/styles/color-brewer.css'; //导入高亮样式
  .hello {
    margin: 20px auto;
    width: 50%;
  }
  a { 
    color: #409EFF;
    text-decoration: none;
  }

  code {
    background-color: #f9fafc;
    padding: 0 4px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
  }

  .hljs {
    line-height: 1.8;
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
    font-size: 12px;
    padding: 18px 24px;
    background-color: #fafafa;
    border: solid 1px #eaeefb;
    margin-bottom: 25px;
    border-radius: 4px;
    -webkit-font-smoothing: auto;
  }
</style>
```



#### 总结

不得不说,一个好的开发架构可以为以为的开发省去太多的事情了.文章中vue-markdown-loader的使用固然重要,更重要的是实现需求的思路!

至此为止,第一个需求算是解决的差不多了,还需要编写具体一些样式才能使用.关于demo-block组件的解析会在下半部分做解析.