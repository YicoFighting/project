import { publicKey, privateKey } from './index';
import JSEncrypt from 'jsencrypt';
/**
 * 非对称加密的加密
 * @param {*} text
 * @returns
 */
export const enRsa = (text) => {
  //实例
  const encryptor = new JSEncrypt();
  //设置对方的公钥
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(text);
};

/**
 * 非对称加密的解密
 * @param {*} text
 * @returns
 */
export const deRsa = (text) => {
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
