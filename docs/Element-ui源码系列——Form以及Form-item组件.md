### Element源码系列——Form、Form-item组件

[TOC]

#### 序言



Element团队将组件主要分为Basic、Form、Data、Notice、Navigation、Others几大类.

如果您跟我一样学习到Form大类的时候,先看Form组件绝对没有错.

在看代码之前还是一样，我们先整理下咱们要做什么?

我们进行组件开发的目的是为了提升日后的开发效率,那么我们先回忆下不使用组件开发而使用jQuery或原生开发表单的麻烦之处.可以想象的是,随着表单规模增加,获取每个input的值、表单验证、表单排版样式都愈加影响开发效率.而Element所开发的组件需求也大抵以此为中心,下面是[Element官网](http://element-cn.eleme.io/#/zh-CN/component/form)对Form组件的定义:

**由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据**



#### 控件组成



我们大致可以把Form大类中的组件结构理解为:

```javascript
Form
	├── Form-Item
		├── Radio
    ├── Form-Item
		├── Input
		....
```

而容器嵌套组件都是使用[Vue的Slot插槽](https://cn.vuejs.org/v2/api/#slot)实现,下面是Form-Item组件中的插槽处理代码:

```html
<div>
	<!-- label容器 -->
    <label :for="labelFor" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
    	<!-- 插槽默认内容为label 加上定义的后缀 -->
    	<slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <!-- 具体输入框等内容容器 -->
    <div class="el-form-item__content" v-bind:style="contentStyle">
    	<slot></slot> <!-- 具体输入框等控件插槽 -->
    <!-- 错误信息展示容器 -->
    	<transition name="el-zoom-in-top">
    		<div
   			 v-if="validateState === 'error' && showMessage && form.showMessage"
              class="el-form-item__error"
              :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
              }"
             >
    			{{validateMessage}}
    		</div>
    	</transition>
</div>
```



#### 数据收集



Form就像主板一样,通过各式各样的插槽(Form-item)将内存、显卡(如:input、Radio)的功能集成在一块统一管理.

那么建立起主板与插槽之间的关系是非常重要的,好在Vue中提供了依赖注入功能.可以非常方便的让我们实现依赖关联.

```javascript
// 我们在Form.vue只需要privide自己即可
provide() {
    return {
    	elForm: this
    };
}
// 然后在Form-Item中注入就可以通过this.elForm使用
inject: ['elForm']
```

考虑到Form做为容器时需要对手下的统一管理调度,我们还需要通过事件关联将所有的手下统一进行数据存放，以便后续使用.

```javascript
// 通过在Form中监听事件来完成数据的存放与删除
data() {
    return {
    	fields: []
	};
},
created() {
	// 监听'el.form.addField 
	// 当触发该事件时, 为fields数组添加form-item实例
    this.$on('el.form.addField', (field) => {
        if (field) {
       		this.fields.push(field);
        }
	});
    // 监听'el.form.addField 
    // 当触发该事件时, 为fields数组移除form-item实例
    this.$on('el.form.removeField', (field) => {
    // 如果定义了规则属性
        if (field.prop) {
            this.fields.splice(this.fields.indexOf(field), 1);
        }
	});
}
```

之后在form-item组件的生命周期中触发相对应的事件,并传入相对应的实例就可以创建数据的关联。以下是form-item的生命周期函数内容:

```javascript
// 代码省略了其他部分逻辑，主要想表达的是在挂载form-item组件时触发添加事件,在摧毁之前触发了移除事件
// dispatch为父类事件转发工具,可以自行查看源码,这里就不介绍了
mounted() {
    // 如果定义了需要验证的字段
    if (this.prop) {
        // 向父亲Form组件添加filed
        this.dispatch('ElForm', 'el.form.addField', [this]);
    }
    ...
},
beforeDestroy() {
	// 移除之前删除form中的数据字段
	this.dispatch('ElForm', 'el.form.removeField', [this]);
}
```



#### 校验数据



Element使用了[async-validator](https://www.npmjs.com/package/async-validator)插件作为表单验证的工具.具体的使用方法和规则定义需以了解此插件前提.

在Form中主要定义了validate、clearValidate、resetFelds、validateField几个方法，这几个方法主要是一些逻辑上的东西，用于管理form-item的验证，实际验证还是在form-item中独立完成.

```javascript
// 这里就可以体现出关联组件,解耦代码的思想,每个组件仅仅做自己事.
// form只做了统一的管理与调度,真正干活的还是小弟
// 验证方法
validate(callback) {
    let valid = true;
    let count = 0;
    // 如果需要验证的fields为空，调用验证时立刻调用callback
    if (this.fields.length === 0 && callback) {
   	 	callback(true);
    }
    let invalidFields = {};
    // 遍历所有字段，挨个验证
    this.fields.forEach(field => {
    
        field.validate('', (message, field) => {
            // 如果有返回信息, 则说明验证失败
            if (message) {
                valid = false;
            }
            // 将错误对象复制到invalidFields
            invalidFields = objectAssign({}, invalidFields, field);
            // 调动回调函数
            if (typeof callback === 'function' && ++count === this.fields.length) {
                callback(valid, invalidFields);
            }
   	    });
    });
},
// 清除验证,如果不传prop就清除所有
clearValidate(props = []) {
    const fields = props.length
     ? this.fields.filter(field => props.indexOf(field.prop) > -1)
     : this.fields;
    fields.forEach(field => {
    	field.clearValidate();
    });
},
// 指定字段进行验证
validateField(prop, cb) {
	let field = this.fields.filter(field => field.prop === prop)[0];
	field.validate('', cb);
},
// 重置所有字段
resetFields() {
    // 遍历重置
    this.fields.forEach(field => {
    	field.resetField();
    });
}
```

form-item中所对应的方法

```javascript
validate(trigger, callback = noop) {
    // 验证禁止关闭
    this.validateDisabled = false;
    // 获取符合trigger的规则
    const rules = this.getFilteredRule(trigger);
    // 如果没有定义规则并且没有定义必须填写
    if ((!rules || rules.length === 0) && this.required === undefined) {
    	// 立即执行回调
    	callback();
    	return true;
    }
    // 改变验证状态为正在验证
    this.validateState = 'validating';

	const descriptor = {};
	// 为了匹配AsyncValidator插件所需要的格式,需要做规则数据做一些操作
    if (rules && rules.length > 0) {
    	rules.forEach(rule => {
    	delete rule.trigger;
    });
    }
    // 生产处AsyncValidator需要的验证规则格式
    descriptor[this.prop] = rules;
	
    const validator = new AsyncValidator(descriptor);
    const model = {};
    // 生产处AsyncValidator需要的验证数据
    model[this.prop] = this.fieldValue;
    // firstField是指当验证规则时发生错误 不再继续向下进行验证
    validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        // 验证状态
        this.validateState = !errors ? 'success' : 'error';
        // 验证信息
        this.validateMessage = errors ? errors[0].message : '';
        // 执行回调函数
        callback(this.validateMessage, invalidFields);
        // 提交validate事件
        this.elForm && this.elForm.$emit('validate', this.prop, !errors);
    });
},
// 清除所有当前验证状态
clearValidate() {
    this.validateState = '';
    this.validateMessage = '';
    this.validateDisabled = false;
},
// 重置所有字段为初始值
resetField() {
    // 清除验证信息与状态
    this.validateState = '';
    this.validateMessage = '';
	// 获取model数据模型中所对应的值
    let model = this.form.model;
    let value = this.fieldValue;
    let path = this.prop;
    if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
    }
	
    let prop = getPropByPath(model, path, true);
	
    this.validateDisabled = true;
    // 重置为一开始获取的初始值
    if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
    } else {
        prop.o[prop.k] = this.initialValue;
    }
},
```



#### 提交数据

官网中的例子已经非常详细了,我们只需要在按钮提交前调用Form的validate方法,就可以对所有规则统一进行验证

```javascript
<el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>


submitForm(formName) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
        	alert('submit!');
        } else {
        	console.log('error submit!!');
        	return false;
        }
    });
}
```



#### 总结

在学习源码时更多的是换位思考的去学习大佬的思想,希望这篇文章可以帮到你！

感谢您的阅读!

再次感谢element团队的贡献!