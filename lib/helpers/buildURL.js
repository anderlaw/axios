'use strict';

var utils = require('./../utils');

function encode(val) {
  //encodeURIComponent是用于编码部分URI；比如：
  /**
   * 将“time & time=2021”作为 input变量的一部分 ,input=encodeURI(time & time=2021)--> "input=time%20&%20time=2021"
   * 可能会被服务器错误识别为两个变量：【 input=time，time=2021 】
   * 而 input=encodeURIComponent(time & time=2021)--> “input=time%20%26%20time%3D2021"则不会。
   */
  return encodeURIComponent(val).
    //再把一些有特殊意义的字符再换回来： :$,+[]
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    //没有提供paramsSerializer函数则 先将key和value用JSON.stringify序列化再用 encode方法进行转义
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    //拷贝出#前面的部分
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    //补充符号“？”
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};
