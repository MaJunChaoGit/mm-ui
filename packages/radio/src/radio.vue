<template>
  <label 
  role="radio" 
  class="el-radio"
  :class="[
    border && radioSize ? 'el-radio--' + radioSize : '',
    { 'is-disabled': isDisabled },
    { 'is-bordered': border },
    { 'is-checked': model === label },
    { 'is-focus': focus }
  ]"
  >
    <span class="el-radio__input">
      <span class="el-radio__inner"></span>
      <input 
      class="el-radio__original"
      type="radio"
      :value="label"
      :name="name"
      :disabled="isDisabled"
      v-model="model"
      >
    </span>
    <span class="el-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
  export default {
    name: 'ElRadio',

    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    componentName: 'ElRadio',

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },

    computed: {
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value;
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      }
    }

  };
</script>