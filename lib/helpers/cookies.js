'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      //将一个对象在一个立即调用函数表达式里返回
      //而不是直接字面量，优点是未来可以在里面添加执行代码：
      /**
       * const result1 = ...
       * if(result11){
       *  ...
       * }
       */
      return {
        //这里没有提供 Max-Age（Number of seconds until the cookie expires），SameSite等的设置
        write: function write(name, value, expires, path, domain, secure) {
          //客户端写cookie不支持httpOnly属性。
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }
          //将cokkie属性以'; '串起来
          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          //正则(^|;\s*),这里开头符号也能做
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);
