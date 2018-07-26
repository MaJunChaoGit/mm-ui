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
      expect(checkboxElm.querySelector('.is-checked')).not.to.be.ok;
      checkboxElm.click();
      setTimeout(_ => {
        expect(vm.checked === true).to.be.true;
        expect(checkboxElm.querySelector('.is-checked')).to.be.ok;
        done();
      }, 10);
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

  it('change event', done => {
    vm = createVue({
      template: `
        <el-checkbox v-model="checked" @change="onChange">
        </el-checkbox>
      `,
      methods: {
        onChange(val) {
          this.data = val;
        }
      },
      data() {
        return {
          data: '',
          checked: false
        };
      }
    }, true);
    let checkboxElm = vm.$el;
    checkboxElm.click();
    setTimeout(_ => {
      expect(vm.data).to.be.true;
      vm.checked = false;
      setTimeout(_ => {
        expect(vm.data).to.be.true;
        done();
      }, 10);
    }, 10);
  });
  it('checkbox-group', done => {
    vm = createVue({
      template: `
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="a" ref="a"></el-checkbox>
          <el-checkbox label="b" ref="b"></el-checkbox>
          <el-checkbox label="c" ref="c"></el-checkbox>
          <el-checkbox label="d" ref="d"></el-checkbox>
        </el-checkbox-group>
      `,
      data() {
        return {
          checkList: []
        };
      }
    }, true);
    expect(vm.checkList.length === 0).to.be.true;
    vm.$refs.a.$el.click();
    vm.$nextTick(_ => {
      expect(vm.checkList.indexOf('a') !== -1).to.be.true;
      done();
    });
  });
  it('checkbox group change event', done => {
    vm = createVue({
      template: `
        <el-checkbox-group v-model="checkList" @change="onChange">
          <el-checkbox label="a" ref="a"></el-checkbox>
          <el-checkbox label="b" ref="b"></el-checkbox>
        </el-checkbox-group>
      `,
      methods: {
        onChange(val) {
          this.data = val;
        }
      },
      data() {
        return {
          data: '',
          checkList: []
        };
      }
    }, true);
    vm.$refs.a.$el.click();
    setTimeout(_ => {
      expect(vm.data).to.deep.equal(['a']);
      vm.checkList = ['b'];
      done();
    });
  });

  it('checkbox group minimum and maximum', done => {
    vm = createVue({
      template: `
        <el-checkbox-group 
          v-model="checkList" 
          :min="1" 
          :max="2"
        >
          <el-checkbox label="a" ref="a"></el-checkbox>
          <el-checkbox label="b" ref="b"></el-checkbox>
          <el-checkbox label="c" ref="c"></el-checkbox>
          <el-checkbox label="d" ref="d"></el-checkbox>
        </el-checkbox-group>
      `,
      data() {
        return {
          checkList: ['a'],
          lastEvent: null
        };
      }
    }, true);
    expect(vm.checkList.length === 1).to.be.true;
    vm.$refs.a.$el.click();
    vm.$nextTick(() => {
      expect(vm.checkList.indexOf('a') !== -1).to.be.true;
      vm.$refs.b.$el.click();
      vm.$nextTick(() => {
        expect(vm.checkList.indexOf('a') !== -1).to.be.true;
        expect(vm.checkList.indexOf('b') !== -1).to.be.true;
        vm.$refs.c.$el.click();
        vm.$nextTick(() => {
          expect(vm.checkList.indexOf('c') !== -1).to.be.false;
          expect(vm.checkList.indexOf('d') !== -1).to.be.false;
          done();
        });
      });
    });
  });

  it('nested group', done => {
    vm = createVue({
      template: `
        <el-checkbox-group v-model="checkList">
          <div>
            <el-checkbox label="a" ref="a"></el-checkbox>
            <el-checkbox label="b" ref="b"></el-checkbox>
            <el-checkbox label="c" ref="c"></el-checkbox>
            <el-checkbox label="d" ref="d"></el-checkbox>
          </div>
        </el-checkbox-group>
      `,
      data() {
        return {
          checkList: []
        };
      }
    }, true);
    expect(vm.checkList.length === 0).to.be.true;
    vm.$refs.a.$el.click();
    vm.$nextTick(_ => {
      expect(vm.checkList.indexOf('a') !== -1).to.be.true;
      done();
    });
  });

  it('true false label', done => {
    vm = createVue({
      template: `
        <el-checkbox true-label="a" :false-label="3" v-model="checked"></el-checkbox>
      `,
      data() {
        return {
          checked: 'a'
        };
      }
    }, true);
    vm.$el.click();
    vm.$nextTick(_ => {
      expect(vm.checked === 3).to.be.true;
      done();
    });
  });
  it('checked', () => {
    vm = createVue({
      template: `
        <div>
          <el-checkbox v-model="checked" checked></el-checkbox>
          <el-checkbox-group v-model="checkList">
            <el-checkbox checked label="a"></el-checkbox>
          </el-checkbox-group>
        </div>
      `,
      data() {
        return {
          checked: false,
          checkList: []
        };
      }
    }, true);
    expect(vm.checked).to.be.true;
    expect(vm.checkList.indexOf('a') !== -1).to.be.true;
  });

  it('checkbox group', done => {
    vm = createVue({
      template: `
        <el-checkbox-group v-model="checkList">
          <el-checkbox-button label="a" ref="a"></el-checkbox-button>
          <el-checkbox-button label="b" ref="b"></el-checkbox-button>
          <el-checkbox-button label="c" ref="c"></el-checkbox-button>
          <el-checkbox-button label="d" ref="d"></el-checkbox-button>
        </el-checkbox-group>
      `,
      data() {
        return {
          checkList: []
        };
      }
    }, true);
    expect(vm.checkList.length === 0).to.be.true;
    //toTO
  });
});
