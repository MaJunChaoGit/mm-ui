<template>
  <label
    class="el-checkbox"
    :class="[
      { 'is-disabled' : isDisabled }
    ]"
    role="checkbox"
  >
    <span class="el-checkbox__input"
      :class="[
        { 'is-disabled' : isDisabled }
      ]"
    >
      <span class="el-checkbox__inner"></span>
      <input 
        class="el-checkbox__original"
        type="checkbox"
        v-model="model"
        :disabled="isDisabled"
      >
    </span>
    <span class="el-checkbox__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElCheckbox',

    mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {},
      disabled: Boolean
    },

    componentName: 'ElCheckbox',

    computed: {
      isGroup() {
        let parent = this.$parent;

        while (parent) {
          if (parent.$options.componentName !== 'ElCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      model: {
        get() {
          return this.isGroup ? this._checkboxGroup.value : this.value;
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'handleChange', [val]);
          } else {
            this.$emit('input', val);
          }
        }
      },
      isDisabled() {
        return this.isGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled;
      }
    }
  };
</script>