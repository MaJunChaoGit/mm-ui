export default {
  methods: {
    dispatch(componentName, eventName, params) {
      // 获取父节点或者是根节点
      var parent = this.$parent || this.$root;
      // 获取父级组件vm对象中的componentName字段
      var name = parent.$options.componentName;
      // 当父节点存在并且没有定义componentName,
      // 或者传入的componentName与当前组件的名称不符合
      // 那么继续反向递归
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }

      if (parent) {
        // emit事件
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    }
  }
};
