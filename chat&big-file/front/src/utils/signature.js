import jsrsasign from 'jsrsasign';

/**
 * 验签
 * @param {*} text 原始值
 * @param {*} data 加签后的值
 */
export const verify = (text, data) => {
  return new Promise((resolve) => {
    try {
      const sig = new jsrsasign.KJUR.crypto.Signature({
        alg: 'SHA256withRSA',
        prvkeypem: `-----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8u6pGXY1+23uVHGdDbz
        mO21Dw9bBGUCe+VbxlWmn16P9RJ1N/gY3wMHyq2RqgTK42XaMeh1QQB7qTXjPXCT
        KfbZDJxg5ccodSQWONv23cOXr3GtVG5bjcS8KcEuGqcO0JnYJOAPF/8qqbpiS/Ir
        bDEhwx9RqEC2UmVFBdBRktS5D21y2ecN/i7z0OvoStsSt0fF9pfZ8R95PrV6uSVb
        NNHFSnDcs6e5KxZN7INH6ZHBNv87tcaFLg1pS23ljsIBI1qPFx72D4DmoPvzCXlI
        mIrvqLJ8zKDJgSTnUfLkE5FRdDFrjB6wESCg8K4lcQWx6bctk7IUV9CBKHHQ7GOG
        VwIDAQAB
        -----END PUBLIC KEY-----
        `,
      });
      sig.updateString(text);
      const isSign = sig.verify(jsrsasign.b64tohex(data));
      resolve(isSign);
    } catch (error) {
      console.log('验签失败:', error);
      resolve(false);
    }
  });
};
