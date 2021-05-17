'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.

  //绝对地址 ：
  /**
   * <schema>://
   * // 相对协议的地址。如https站点上的//开头链接会使用https协议，反之亦然
   */
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
