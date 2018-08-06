### Element源码系列——Row以及Col组件

[TOC]

#### 序言



官网中对Layout 布局的定义是: **通过基础的 24 分栏，迅速简便地创建布局. **

Element中的栅格系统也与Bootstrap类似,组件开发的目的都是为了解决基本布局定位的问题.

Layout主要组件为Row与Col,其中Row为行布局容器,Col为列布局容器.

话不多说,先来看看Row的部分.



#### Row



Row是行布局容器,从功能上来说它的作用是**控制内部元素的排列方式**.我们边看代码边说.

```javascript
name: 'ElRow',

componentName: 'ElRow',

// Row组件中的props
props: {
    tag: {
      type: String,    // 通过传入不同的tag来让row生成不同的标签
      default: 'div'
    },
    gutter: Number,    // gutter翻译是排水沟,非常贴切,它的作用是控制Row中元素的间隔
    type: String,      // type主要是控制是否以flex进行布局
    justify: {         // flex元素中水平排列规则
      type: String,
      default: 'start'
    },
    align: {
      type: String,    // flex元素中垂直排列规则
      default: 'top'
    }
}
```



将props与CSS3中的flex布局相结合,Row的用法就非常清晰了

| 参数    | 说明                                  | 类型   | 可选值                                      | 默认值 |
| ------- | ------------------------------------- | ------ | ------------------------------------------- | ------ |
| gutter  | 栅格间隔                              | number | —                                           | 0      |
| type    | 布局模式，可选 flex，现代浏览器下有效 | string | —                                           | —      |
| justify | flex 布局下的水平排列方式             | string | start/end/center/space-around/space-between | start  |
| align   | flex 布局下的垂直排列方式             | string | top/middle/bottom                           | top    |
| tag     | 自定义元素标签                        | string | *                                           | div    |



Row的代码很精简,但是有两个细节咱们需要处理.

1.通过gutter设置元素间隔时,由于设置子元素的padding-left与padding-right来控制间隔,导致首尾也会有间隔.

通过控制Row的margin-left和margin-right为负值可以解决.

```javascript
computed: {
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    }
}
```

2.因为需要自定义渲染HTML标签,所以常规的`template`写法不可用了,需要使用[render函数](https://cn.vuejs.org/v2/api/#render)进行渲染.

```javascript
render(h) {
    return h(this.tag, { // 自定义渲染标签
      class: [
        'el-row', // 组件基本样式
        this.justify !== 'start' ? `is-justify-${this.justify}` : '', // 水平排列样式名生成
        this.align !== 'top' ? `is-align-${this.align}` : '', // 垂直排列样式名生成
        { 'el-row--flex': this.type === 'flex' } // flex布局样式
      ],
      style: this.style
    }, this.$slots.default);
}
```

到此Row的代码就结束了,一个组件的使用体验完全取决于程序猿的细节把控,千万不要忽视细节!



#### Col

Col要比Row稍微复杂一些,我们先从简单的一步一步来看.

同样的,先看下props中有哪些属性:

```javascript
name: 'ElCol',

component: 'ElCol',

props: {
    span: {                 // 控制col在父元素中占的比例
        type: Number,
        default: 24
    },
    tag: {
        type: String,       // 自定义渲染的标签
        default: 'div'
    },
    offset: Number,         // 栅格左侧的间隔格数
    pull: Number,           // 栅格向右移动格数
    push: Number,           // 栅格向左移动格数
    xs: [Number, Object],   // <768px 响应式栅格数或者栅格属性对象
    sm: [Number, Object],   // ≥768px 响应式栅格数或者栅格属性对象
    md: [Number, Object],   // ≥992px 响应式栅格数或者栅格属性对象
    lg: [Number, Object],   // ≥1200px 响应式栅格数或者栅格属性对象
    xl: [Number, Object]    // ≥1920px 响应式栅格数或者栅格属性对象
}
```

从props可以看出主要分为元素基本大小与定位控制,响应式控制功能点,而响应式控制是基于第一个功能点为基础.

所以我们先看看span、offset、pull、push是如何被使用的.

```javascript
// col.js文件
render(h) {
    let classList = [];
	// 这里逻辑是通过比对props对象,生成对应的CSS规则
    ['span', 'offset', 'pull', 'push'].forEach(prop => {
          if (this[prop] || this[prop] === 0) {
            classList.push(
              prop !== 'span'
                ? `el-col-${prop}-${this[prop]}` // e.g el-col-offset-6
                : `el-col-${this[prop]}`         // e.g el-col-5
            );
          }
    });
    
    ....
}
// 具体对应样式文件col.scss
// scss可以通过@for实现循环添加样式
// 栅格化具体计算公式 (1 / 24 * $i * 100) * 1%
@for $i from 0 through 24 {
  .el-col-#{$i} {
    width: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-offset-#{$i} {
    margin-left: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-pull-#{$i} {
    position: relative;
    right: (1 / 24 * $i * 100) * 1%;
  }

  .el-col-push-#{$i} {
    position: relative;
    left: (1 / 24 * $i * 100) * 1%;
  }
}
```

同样的，响应式的原理相差不多,差别在于响应式支持传入一个对象.

```javascript
let classList = [];

['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      // 这里分为传入对象以及数字两种情况
      if (typeof this[size] === 'number') {
        classList.push(`el-col-${size}-${this[size]}`); // e.g el-col-xs-4
      } else if (typeof this[size] === 'object') {
        let props = this[size];
        // 遍历对象
        Object.keys(props).forEach(prop => {
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}` // e.g el-col-xs-offset-4
              : `el-col-${size}-${props[prop]}`         // e.g el-col-xs-4
          );
        });
      }
});
```

如何优雅的使用scss写出响应式:

```scss
// var.scss

// 定义断点值的变量
$--sm: 768px !default;
$--md: 992px !default;
$--lg: 1200px !default;
$--xl: 1920px !default;

// 定义断点对象
$--breakpoints: (
  'xs' : (max-width: $--sm),
  'sm' : (min-width: $--sm),
  'md' : (min-width: $--md),
  'lg' : (min-width: $--lg),
  'xl' : (min-width: $--xl)
);

// mixins.scss
@mixin res($key, $map: $--breakpoints) {
  // 循环断点Map，如果存在则返回
  @if map-has-key($map, $key) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "Undefined points: `#{$map}`";
  }
}

// col.scss
@include res(xs) {
  .el-col-xs-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .el-col-xs-#{$i} {
      width: (1 / 24 * $i * 100) * 1%;
    }

    .el-col-xs-offset-#{$i} {
      margin-left: (1 / 24 * $i * 100) * 1%;
    }

    .el-col-xs-pull-#{$i} {
      position: relative;
      right: (1 / 24 * $i * 100) * 1%;
    }

    .el-col-xs-push-#{$i} {
      position: relative;
      left: (1 / 24 * $i * 100) * 1%;
    }
  }
}
```

最后,有个小细节处理下.

Row中的gutter是负责每个元素的间隔,它是统一的数值.并且需要传入到Col中使用,用来生成子元素的pading-left与padding-right.如果让用户传入的话本身不太合理,并且也增加组件使用的复杂性.

```javascript
// 反向递归查找第一个名为ElRow的父组件
computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
},
render(h) {
    let style = {};
	// 通过父组件的gutter生成自生的padding-left与padding-right
    if (this.gutter) {
        style.paddingLeft = this.gutter / 2 + 'px';
        style.paddingRight = style.paddingLeft;
    }
    
    return h(this.tag, { // render返回渲染
      class: ['el-col', classList],
      style
    }, this.$slots.default);
}
```



#### 总结

Row和Col就结束了,组件还是比较简单的,但是其中的细节处理与思想才是重点,希望可以帮到你!

感谢您的阅读!

再次感谢element团队的贡献!

