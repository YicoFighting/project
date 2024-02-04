const { enRsa, deRsa } = require('./jsencrypt.js');
const { deaes, enaes } = require('./crypto.js');
const { createSign } = require('./signature');
//解析参数
const resolutionRes = (key, params) => {
  //非对称解密key
  const aesKey = deRsa(key);
  //对称解密数据
  return {
    aesKey,
    data: JSON.parse(deaes(params, aesKey)),
  };
};

//加密返回数据
const encryption = (aesKey, res) => {
  //非对称加密key
  const newAesKey = enRsa(aesKey);
  return {
    key: newAesKey,
    sign: createSign(aesKey),
    data: enaes(JSON.stringify(res), aesKey),
  };
};

/**
 * 生成n位数字字母混合得字符串
 * @param {*} n
 * @returns
 */
const generateMixed = (n) => {
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  let res = '';
  for (let i = 0; i < n; i++) {
    res += chars[Math.floor(Math.random() * 36)];
  }
  return res;
};

module.exports = { resolutionRes, encryption, generateMixed };
