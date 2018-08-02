<template>
  <form class="el-form" :class="[

    labelPosition ? 'el-form--label-' + labelPosition : '', // 用于定位label的位置, 参数为left, top, right
    { 'el-form--inline': inline } // 行内排列表单内元素, 当同时使用inline和labelPosition时样式效果不好
  ]">
    <slot></slot>
  </form>
</template>
<script>
  import objectAssign from 'element-ui/src/utils/merge';

  export default {
    name: 'ElForm',

    componentName: 'ElForm',

    provide() {
      return {
        elForm: this
      };
    },

    props: {
      model: Object, // 表单内数据模型
      rules: Object, // 表单验证规则
      labelPosition: String, // 表单中label的定位
      labelWidth: String, // 表单中label块的宽度
      labelSuffix: { // label的后缀
        type: String,
        default: ''
      },
      inline: Boolean, // 是否行内显示表单元素
      inlineMessage: Boolean, // 行内显示验证信息
      statusIcon: Boolean, // 是否显示验证小图标
      showMessage: { // 显示验证信息
        type: Boolean,
        default: true
      },
      size: String, // 表单中元素的尺寸
      disabled: Boolean, // 是否禁用表单元素
      validateOnRuleChange: { // rules改变直接触发表单验证
        type: Boolean,
        default: true
      }
    },
    watch: { // 监听rules的变化，如果validateOnRuleChange为true的话触发更新
      rules() {
        if (this.validateOnRuleChange) {
          this.validate(() => {});
        }
      }
    },
    data() {
      return {
        fields: []
      };
    },
    created() {
      // 监听'el.form.addField
      // 当触发该事件时, 为fields数组增加字段
      /* istanbul ignore next */
      this.$on('el.form.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      // 监听'el.form.addField
      // 当触发该事件时, 为fields数组移除字段
      /* istanbul ignore next */
      this.$on('el.form.removeField', (field) => {
        // 如果定义了规则属性
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      // 重置所有字段
      resetFields() {
        // 如果form没有数据模型则报出警告
        if (!this.model) {
          process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Form]model is required for resetFields to work.');
          return;
        }
        // 遍历重置
        this.fields.forEach(field => {
          field.resetField();
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
      // 验证方法
      validate(callback) {
        // 如果没有可验证的数据产生警告
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!');
          return;
        }

        let promise;
        // if no callback, return promise
        // 如果没有回调函数, 则返回一个promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid) {
              valid ? resolve(valid) : reject(valid);
            };
          });
        }

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

        // 如果有promise则返回
        if (promise) {
          return promise;
        }
      },
      // 指定字段进行验证
      validateField(prop, cb) {
        let field = this.fields.filter(field => field.prop === prop)[0];
        if (!field) { throw new Error('must call validateField with valid prop string!'); }

        field.validate('', cb);
      }
    }
  };
</script>
