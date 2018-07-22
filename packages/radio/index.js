import ElRadio from './src/radio';

/* istanbul ignore next */
ElRadio.install = function(Vue) {
  Vue.component(ElRadio.name, ElRadio);
};

export default ElRadio;
