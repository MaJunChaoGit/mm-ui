<template>
  <div>
    <div>
    <el-radio v-model="radio7" label="1" border>备选项1</el-radio>
    <el-radio v-model="radio7" label="2" border>备选项2</el-radio>
  </div>
  <div style="margin-top: 20px">
    <el-radio v-model="radio8" label="1" border size="medium">备选项1</el-radio>
    <el-radio v-model="radio8" label="2" border size="medium">备选项2</el-radio>
  </div>
  <div style="margin-top: 20px">
      <el-radio label="1" border size="small">备选项1</el-radio>
      <el-radio label="2" border size="small">备选项2</el-radio>
  </div>
  <div style="margin-top: 20px">
      <el-radio label="1" border size="mini">备选项1</el-radio>
      <el-radio label="2" border size="mini">备选项2</el-radio>
  </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radio1: '选中且禁用'
      };
    }
  }
</script>