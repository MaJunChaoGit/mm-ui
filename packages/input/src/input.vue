<template>
  <!-- 模板这里要考虑的需求为:
    1.input
  1.通过slot = prefix-icon 和 slot = suffix-icon 可以为input框内设置小图标,可以支持直接props
  2.通过slot="prepend" 和 slot="append" 为input增加前置后置元素
  3.disabled,clearable,size样式分别显示
  4.type值可以设置为textarea -->


  <div
    class="el-input"
    :class="[
      size ? 'el-input--' + inputSize : '',
      { 'is-disabled' : inputDisabled }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tableindex="tabindex"
        class="el-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span class="el-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear"
      >
      <span class="el-input__suffix-inner">
        <template v-if="!showClear">
          <slot name="suffix"></slot>
          <i class="el-input__icon"
             v-if="suffixIcon"
             :class="suffixIcon">
          </i>
        </template>
        <i
          v-else
          class="el-input__icon el-icon-circle-close el-input__clear"
          @click="clear"
        ></i>
      </span>
        
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tableindex="tableindex"
      class="el-input__inner"
      @input="handleInput"
      ref="textarea"
      :value="currentValue"
      v-bind="$attrs"
      :disabled="inputDisabled"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      :aria-label="label"
    ></textarea>
  </div>
</template>
<script>
  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },

    data() {
      return {
        currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,
        focused: false,
        hovering: false
      };
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      inputSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      showClear() {
        return this.clearable &&
          !this.disabled &&
          !this.readonly &&
          this.currentValue !== '' &&
          (this.focused || this.hovering);
      }
    },
    props: {
      value: [String, Number],
      size: String,
      resize: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autosize: { //
        type: [Boolean, Object],
        default: false
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      suffixIcon: String,
      prefixIcon: String,
      label: String, //
      clearable: Boolean,
      tabindex: String //
    },
    methods: {
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
      handleInput(event) {
        this.$emit('input', event.target.value);
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
      },
      clear() {
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
        this.currentValue = '';
        this.focus();
      },
      focus() {
        (this.$refs.input || this.$refs.textarea).focus();
      },
      setCurrentValue(val) {
        this.currentValue = val;
      }
    },
    watch: {
      value(val) {
        this.setCurrentValue(val);
      }
    }
  };
</script>