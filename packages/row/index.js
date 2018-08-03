import ElRow from './src/row';

/* istanbul ignore next */
ElRow.install = function(Vue) {
  Vue.component(ElRow.name, ElRow);
};

export default ElRow;
