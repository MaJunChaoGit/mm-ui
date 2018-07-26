<template>
        <div>
          <el-checkbox v-model="checked" checked></el-checkbox>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="a"></el-checkbox>
          </el-checkbox-group>
        </div>
</template>
<script>
  export default {
      data() {
        return {
          checked: false,
          checkList: []
        };
      }
  }
</script>