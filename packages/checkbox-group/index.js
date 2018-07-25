import ElCheckboxGroup from '../checkbox/src/checkbox-group';

/* istanbul ignore next */
ElCheckboxGroup.install = function(Vue) {
  Vue.component(ElCheckboxGroup.name, ElCheckboxGroup);
};

export default ElCheckboxGroup;
