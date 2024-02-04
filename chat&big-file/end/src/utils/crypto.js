const CryptoJS = require('crypto-js');
/**
 * 对称加密的加密
 * @param {*} text 加密的内容
 * @param {*} key
 * @returns
 */
const enaes = (text, key = '1234567890') =>
  CryptoJS.AES.encrypt(text, key).toString();
/**
 * 对称加密的解密
 * @param {*} text
 * @param {*} key
 * @returns
 */
const deaes = (text, key = '1234567890') =>
  CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);

module.exports = {
  enaes,
  deaes,
};
