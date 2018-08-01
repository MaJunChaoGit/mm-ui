### Element源码系列——Form以及Form-item组件

[TOC]

#### 序言

Element团队将组件主要分为Basic、Form、Data、Notice、Navigation、Others几大类.

如果您跟我一样学习到Form大类的时候,先看Form组件绝对没有错.

在看代码之前还是一样，我们先整理下咱们要做什么?

我们进行组件开发的目的是为了提升日后的开发效率,那么我们先回忆下不使用组件开发而使用jQuery或原生开发表单的麻烦之处.可以想象的是,随着表单规模增加,获取每个input的值、表单验证、表单排版样式都愈加影响开发效率.

而Element所开发的组件需求也大抵以此为中心,下面是[Element官网](http://element-cn.eleme.io/#/zh-CN/component/form)对Form组件的定义:

**由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据**