const jsrsasign = require('jsrsasign');

const createSign = (text) => {
  try {
    const sig = new jsrsasign.KJUR.crypto.Signature({
      alg: 'SHA256withRSA',
      prvkeypem: `-----BEGIN PRIVATE KEY-----
      MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjy7qkZdjX7be5
      UcZ0NvOY7bUPD1sEZQJ75VvGVaafXo/1EnU3+BjfAwfKrZGqBMrjZdox6HVBAHup
      NeM9cJMp9tkMnGDlxyh1JBY42/bdw5evca1UbluNxLwpwS4apw7Qmdgk4A8X/yqp
      umJL8itsMSHDH1GoQLZSZUUF0FGS1LkPbXLZ5w3+LvPQ6+hK2xK3R8X2l9nxH3k+
      tXq5JVs00cVKcNyzp7krFk3sg0fpkcE2/zu1xoUuDWlLbeWOwgEjWo8XHvYPgOag
      +/MJeUiYiu+osnzMoMmBJOdR8uQTkVF0MWuMHrARIKDwriVxBbHpty2TshRX0IEo
      cdDsY4ZXAgMBAAECggEAIUNVQt9/+tHGtra5o44pSAw18bn/lNPifkCks5FfRgwR
      FgbKkTQr8NYPtgQriahxf16Gwg3gCfRMKJ/N5wM+j44Wo+3564/XUnqinKdm6cA3
      xKREO9oxc4fZYm1drIHyi0BC2bI6vnfONSupnJywXsdXgOWSUqXZoL/6FWUpu7Ru
      F+6rkn6aLF+qhvh4M5X2PoiIYs/rRf2bvQpgFxXp1ENgEPZ8QJSGocGD3J6ikvo6
      zb+Zg0siHDfiXNrN2bs8U7oh34Cqh1+Ev+idlJHJznpCnW0Ku+24TFerM2HVAe/m
      FomeFNDfToLxLAT600jcMEf3elfgHC741MCuWm2tIQKBgQDYgjWJ2ft1FjqsNUy0
      D8SfcNEFkhlzj0ZINd1loI+KozNZCdH3JU29ncr9s0AsQZljoOP2ukjApC/b4KH8
      I/gMeQIbkgqLpsAQY3UA1XqAiwCMfyI+mLGUpFm/x+K+n2yb33ck0BjDYdOyhmLs
      qRphgTpbJtKYtjJTGFRtoBT+xwKBgQDBrB1RSgyNrFkED6rWhC2OD2rTy0ys8DWt
      257CYFAWz+ECKhEIntItwAiYGki4kHf5t9ZOfJDNfs4sIYvJoWVMG+Gptk+trHDR
      BPgKAzonKlWQ4+aHUOm4WjnwLgDT4c31YBsm0KnOJrn7MCSojRDaFx6/akANvXMS
      45hMVEnr8QKBgCzPZj1NvFmTbDlQHrv1t4A4XUqF3naoZKd1Xok2Hf9Xn70B5077
      jYd9LRItE08VlKWmGwhprb0RPkaHy37gAuqx8Nm79CrLLF03+HNfu6b3Hfn2JiRG
      fhqBmYGz4R4K6POp4ILh/v4RNTtxzO+mYCtmD6nl8xhgPTItiuvVggLpAoGAeB8Q
      cALFlnl3HJW7GCITPzFAyOwnOnwiTxsQdO7Xvc5heL4uonIfWlDpA64JvK+eOjxT
      p4qLJWmo5qZH1V9NPM9uP5zb/pQdxQaX8V3fC7uuJpezu+nrjHQpy1Y9HS3IWJCr
      Rn/VUg+i+rD5i7Ey6pG8eGymHd+LKAQRygXdc4ECgYAQsXOXF6xpeQYWknLCRzUf
      +C0cNQ8Ed85B/ypbHLYvONhI/fe4Of7JORl7dKr0d0Ww9b2CQAGZDtMamejXVwPp
      eDSTHtqInVPz+UN/fLKfoiafzdBTT1/Brb08KL1ZdPjzZssz9eNaeMwu3T9cmfnu
      XdubvO5srMs9EZw9jwurGw==
      -----END PRIVATE KEY-----
      `,
    });
    sig.updateString(text);
    return jsrsasign.hextob64(sig.sign());
  } catch (error) {
    console.log('error:', error);
  }
};
module.exports = {
  createSign,
};
