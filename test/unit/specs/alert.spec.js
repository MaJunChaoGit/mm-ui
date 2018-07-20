import { createTest, createVue, destroyVM } from '../util.js';
import Alert from 'packages/alert';

describe('Alert', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Alert, {
      title: 'test',
      showIcon: true
    }, true);
    expect(vm.$el.querySelector('.el-alert__title').textContent).to.equal('test');
    expect(vm.$el.classList.contains('el-alert--info')).to.be.true;
  });

  it('type', () => {
    vm = createTest(Alert, {
      title: 'test',
      type: 'success',
      showIcon: true
    }, true);
    expect(vm.$el.classList.contains('el-alert--success')).to.be.true;
  });

  it('description', () => {
    vm = createTest(Alert, {
      title: 'test',
      description: 'Unbowed, Unbent, Unbroken',
      showIcon: true
    }, true);
    expect(vm.$el.querySelector('.el-alert__description').textContent)
      .to.equal('Unbowed, Unbent, Unbroken');
  });

  it('close', () => {
    vm = createVue({
      template: `
        <div>
          <el-alert
            title="test"
            close-test="close"></el-alert>
        </div>
      `
    }, true);
    vm.$el.querySelector('.el-alert__closebtn').click();
    expect(vm.$children[0].visible).to.false;
  });
});
