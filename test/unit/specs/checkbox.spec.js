import { createVue, destroyVM } from '../util';

describe('Checkbox', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', done => {
    vm = createVue({
      template: `
        <el-checkbox v-model="checked">备选项</el-checkbox>
      `,
      data() {
        return {
          checked: true
        };
      }
    }, true);
    let checkboxElm = vm.$el;
    expect(checkboxElm.classList.contains('el-checkbox')).to.be.true;
    checkboxElm.click();
    setTimeout(_ => {
      expect(vm.checked === false).to.be.true;
      done();
    }, 10);
  });

  it('disabled', done => {
    vm = createVue({
      template: `
        <el-checkbox v-model="checked" disabled>备选项</el-checkbox>
      `,
      data() {
        return {
          checked: true
        };
      }
    }, true);
    let checkboxElm = vm.$el;
    expect(checkboxElm.classList.contains('is-disabled')).to.be.true;
    checkboxElm.click();
    setTimeout(_ => {
      expect(vm.checked).to.equal(true);
      done();
    }, 10);
  });
});
