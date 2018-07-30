<template>
  <div class="el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <label :for="labelFor" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{ label + form.labelSuffix }}</slot>
    </label>
    <div class="el-form-item__content" v-bind:style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div
          v-if="validateState === 'error' && showMessage && form.showMessage"
          class="el-form-item__error"
          :class="{
            'el-form-item__error--inline' : typeof inlineMessage === 'boolean'
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
  import Emitter from 'element-ui/src/utils/emitter';
  import objectAssign from 'element-ui/src/utils/merge';
  import { noop, getPropByPath } from 'element-ui/src/utils/util';

  export default {
    name: 'ElFormItem',

    componentName: 'ElFormItem',

    mixins: [Emitter],

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

    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isNested: false
      };
    },

    mounted() {
      if (this.prop) {
        this.dispath('ElForm', 'el.form.addField', [this]);

        let initialValue = this.fieldValue;
      }
    },

    computed: {
      fieldValue: {
        cache: false,
        get() {
          const model = this.form.model;
          if (!model || !this.prop) { return; }

          let path = this.prop;
          if (path.indexOf(':') !== -1) {
            path = path.replace(/:/, '.');
          }

          return getPropByPath(model, path, true).v;
        }
      }
    }
  }
</script>