import { generateMixed, enaes, deaes, enRsa, deRsa, verify } from './index';
/**
 *
 * @param {*} oldObj  参数:对象
 */
export const cryptParams = (oldObj) => {
  const obj = {};
  //随机生成一个AES密钥
  const aesKey = generateMixed(10);
  //RSA公钥加密之后的AES密钥
  obj['key'] = enRsa(aesKey);
  //将对象转为json再加密
  obj['params'] = enaes(JSON.stringify(oldObj), aesKey);
  return obj;
};
/**
 * 解析返回的数据
 * @param {*} res 后端数据
 * @returns
 */
export const resolutionRes = (res) => {
  return new Promise(async (resolve, reject) => {
    //非对称解密
    const key = deRsa(res['key']);
    //验签
    const isSign = await verify(key, res['sign']);
    //对称解密
    if (isSign) {
      try {
        const data = JSON.parse(deaes(res['data'], key));
        resolve(data);
      } catch (error) {
        console.log('解密数据失败:', error);
        reject(error);
      }
    } else {
      console.log('验签失败');
      reject(new Error('验签失败'));
    }
  });
};
