'use strict';
//判断参数是否是Cancel的示例
module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
