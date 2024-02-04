const JSEncrypt = require('node-jsencrypt');
const { privateKey, publicKey } = require('./constant');
/**
 * 非对称加密的加密
 * @param {*} text
 * @returns
 */
const enRsa = (text) => {
  try {
    //实例
    const encryptor = new JSEncrypt();
    //设置对方的公钥
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(text);
  } catch (error) {
    console.log('enRsa:', error);
  }
};

/**
 * 非对称加密的解密
 * @param {*} text
 * @returns
 */
const deRsa = (text) => {
  try {
    //实例
    const encryptor = new JSEncrypt();
    //设置自己的私钥
    encryptor.setPrivateKey(privateKey);
    return encryptor.decrypt(text);
  } catch (error) {
    console.log('deRsa:', error);
  }
};

module.exports = { enRsa, deRsa };
