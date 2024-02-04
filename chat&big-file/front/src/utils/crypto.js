import CryptoJS from 'crypto-js';
/**
 * 对称加密的加密
 * @param {*} text 加密的内容
 * @param {*} key
 * @returns
 */
export const enaes = (text, key = '1234567890') =>
  CryptoJS.AES.encrypt(text, key).toString();

/**
 * 对称加密的解密
 * @param {*} text
 * @param {*} key
 * @returns
 */
export const deaes = (text, key = '1234567890') =>
  CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
