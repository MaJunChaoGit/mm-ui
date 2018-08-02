<template>
  <div class="el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon, // 验证后反馈图标
      'is-error': validateState === 'error', // 验证参数错误样式
      'is-validating': validateState === 'validating', // 正在验证状态样式
      'is-success': validateState === 'success', // 验证成功样式
      'is-required': isRequired || required //
    },
    sizeClass ? 'el-form-item--' + sizeClass : '' // 组件大小样式
  ]">
    <!-- label容器 -->
    <label :for="labelFor" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <!-- 插槽默认内容为label 加上定义的后缀 -->
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <!-- 具体输入框等内容容器 -->
    <div class="el-form-item__content" v-bind:style="contentStyle">
      <slot></slot>
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
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from 'element-ui/src/mixins/emitter';
  import objectAssign from 'element-ui/src/utils/merge';
  import { noop, getPropByPath } from 'element-ui/src/utils/util';

  export default {
    name: 'ElFormItem',

    componentName: 'ElFormItem',

    mixins: [emitter],

    provide() {
      return {
        elFormItem: this
      };
    },

    inject: ['elForm'],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: {
        type: Boolean,
        default: undefined
      },
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      for: String,
      inlineMessage: {
        type: [String, Boolean],
        default: ''
      },
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String
    },
    watch: {
      // 设置该值会让验证直接错误, 并显示出错误信息
      error: {
        immediate: true,
        handler(value) {
          this.validateMessage = value;
          this.validateState = value ? 'error' : '';
        }
      },
      validateStatus(value) {
        this.validateState = value;
      }
    },
    computed: {
      // label的for属性
      labelFor() {
        return this.for || this.prop;
      },
      // label的宽度样式控制
      labelStyle() {
        const ret = {};
        if (this.form.labelPosition === 'top') return ret;
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.width = labelWidth;
        }
        return ret;
      },
      // 具体内容margin-left控制
      contentStyle() {
        const ret = {};
        const label = this.label;
        if (this.form.labelPosition === 'top' || this.form.inline) return ret;
        if (!label && !this.labelWidth && this.isNested) return ret;
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) {
          ret.marginLeft = labelWidth;
        }
        return ret;
      },
      // 反向递归获取父类
      form() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'ElForm') {
          // 是否使用form-item嵌套
          if (parentName === 'ElFormItem') {
            this.isNested = true;
          }
          // 获取父类中定义的组件名
          parent = parent.$parent;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      fieldValue: {
        cache: false,
        get() {
          // 获取父类中的数据模型
          const model = this.form.model;
          // 如果父类没有定义数据模型并且form-item本身不需要验证字段
          if (!model || !this.prop) { return; }

          // 获取验证的属性名
          let path = this.prop;
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }
          // 获取model中该字段的值
          return getPropByPath(model, path, true).v;
        }
      },
      isRequired() {
        // 判断规则中是否定义required
        let rules = this.getRules();
        let isRequired = false;

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true;
              return false;
            }
            return true;
          });
        }
        return isRequired;
      },
      _formSize() {
        return this.elForm.size;
      },
      elFormItemSize() {
        return this.size || this._formSize;
      },
      sizeClass() {
        return this.elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isNested: false
      };
    },
    methods: {
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
        this.validateState = '';
        this.validateMessage = '';

        let model = this.form.model;
        let value = this.fieldValue;
        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        let prop = getPropByPath(model, path, true);

        this.validateDisabled = true;
        if (Array.isArray(value)) {
          prop.o[prop.k] = [].concat(this.initialValue);
        } else {
          prop.o[prop.k] = this.initialValue;
        }

        this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue);
      },
      getRules() {
        // 获取父类form的验证规则
        let formRules = this.form.rules;
        // 获取自己定义的验证规则
        const selfRules = this.rules;
        // 获取required参数
        const requiredRule = this.required !== undefined ? { required: !!this.required } : [];
        // 获取总规则列表中具体该组件需要验证的具体规则
        const prop = getPropByPath(formRules, this.prop || '');
        formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : [];
        // 以自己定义的规则为优先与required规则合并
        return [].concat(selfRules || formRules || []).concat(requiredRule);
      },
      getFilteredRule(trigger) {
        const rules = this.getRules();
        // 根据传入的trigger再次筛选出没有trigger的规则 以及符合参数trigger的rules
        return rules.filter(rule => {
          // 如果没有规则,或者没有传入trigger参数时
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        }).map(rule => objectAssign({}, rule));
      },
      // 验证所有blur
      onFieldBlur() {
        this.validate('blur');
      },
      // 验证所有change
      onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }

        this.validate('change');
      }
    },
    mounted() {
      // 如果定义了需要验证的字段
      if (this.prop) {
        // 向父亲Form组件添加filed
        this.dispatch('ElForm', 'el.form.addField', [this]);

        // 获取初始值
        let initialValue = this.fieldValue;
        // 重新赋值对象，切断引用关系
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        // 定义初始值属性之后使用
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        // 获取组件上定义的验证规则
        let rules = this.getRules();

        // 这里先监听两个事件,为了与以后input等组件关联事件做准备
        if (rules.length || this.required !== undefined) {
          this.$on('el.form.blur', this.onFieldBlur);
          this.$on('el.form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy() {
      // 移除之前删除form中的数据字段
      this.dispatch('ElForm', 'el.form.removeField', [this]);
    }
  };
</script>

