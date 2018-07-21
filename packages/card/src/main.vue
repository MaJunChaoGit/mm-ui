<template>
  <div class="el-card" :class="[hoverStyle]">
    <div class="el-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ElCard',
    props: {
      shadow: {
        type: String,
        default: 'always'
      },
      bodyStyle: {},
      header: {}
    },
    computed: {
      hoverStyle() {
        return 'is-' + this.shadow + '-shadow';
      }
    }
  };
</script>