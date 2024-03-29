/**
 * 生成n位数字字母混合得字符串
 * @param {*} n
 * @returns
 */
export const generateMixed = (n) => {
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
