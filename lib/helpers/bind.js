'use strict';
//bind函数就不用多说了吧？绑定一个函数和上下文，返回一个闭包函数，闭包函数内执行绑定的函数
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
