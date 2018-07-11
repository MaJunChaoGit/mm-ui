var path = require('path');

// 路径别名导出
exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'element-ui': path.resolve(__dirname, '../')
};
// 不进行测试的文件与路径
exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;
