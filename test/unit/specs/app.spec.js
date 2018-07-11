import Vue from 'vue';
import app from '../../../packages/app.vue';

describe('test app.vue', () => {
  it('组件加载后,title应该是Hello World', () => {
    let vm = new Vue(app).$mount();
    expect(vm.title).to.equal('Hello World');
  });
});
