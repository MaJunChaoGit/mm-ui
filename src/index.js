/* Automatically generated by './build/bin/build-entry.js' */

import Icon from '../packages/icon/index.js';
import Alert from '../packages/alert/index.js';
import Button from '../packages/button/index.js';
import ButtonGroup from '../packages/button-group/index.js';
import Card from '../packages/card/index.js';
import Radio from '../packages/radio/index.js';
import RadioButton from '../packages/radio-button/index.js';
import RadioGroup from '../packages/radio-group/index.js';
import Checkbox from '../packages/checkbox/index.js';
import CheckboxButton from '../packages/checkbox-button/index.js';
import CheckboxGroup from '../packages/checkbox-group/index.js';
import Input from '../packages/input/index.js';
import Form from '../packages/form/index.js';
import FormItem from '../packages/form-item/index.js';
import Row from '../packages/row/index.js';
import Col from '../packages/col/index.js';
// import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
  Icon,
  Alert,
  Button,
  ButtonGroup,
  Card,
  Radio,
  RadioButton,
  RadioGroup,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  // locale.use(opts.locale);
  // locale.i18n(opts.i18n);

  components.map(component => {
    Vue.component(component.name, component);
  });

  // Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  // Vue.prototype.$loading = Loading.service;
  // Vue.prototype.$msgbox = MessageBox;
  // Vue.prototype.$alert = MessageBox.alert;
  // Vue.prototype.$confirm = MessageBox.confirm;
  // Vue.prototype.$prompt = MessageBox.prompt;
  // Vue.prototype.$notify = Notification;
  // Vue.prototype.$message = Message;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  version: '1.0.0',
  // locale: locale.use,
  // i18n: locale.i18n,
  install,
  CollapseTransition,
  // Loading,
  Icon,
  Alert,
  Button,
  ButtonGroup,
  Card,
  Radio,
  RadioButton,
  RadioGroup,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Input,
  Form,
  FormItem,
  Row,
  Col
};

module.exports.default = module.exports;
