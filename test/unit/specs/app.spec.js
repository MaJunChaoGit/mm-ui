import Vue from 'vue';
import app from '../../../packages/app.vue';
console.log(Vue);
describe('test app.vue', () => {
  it('组件加载后,title应该是Hello World', () => {
    let vm = new Vue(app).$mount();
    expect(vm.title).toEqual('Hello World');
  });
});
