/**
 * 获取浏览器设备指纹
 * @returns
 */
const getBrowserFingerprint = () => {
  return new Promise((resolve, reject) => {
    try {
      let visitorId = null;
      const fpPromise = import("https://openfpcdn.io/fingerprintjs/v4").then(
        (FingerprintJS) => FingerprintJS.load()
      );

      fpPromise
        .then((fp) => fp.get())
        .then((result) => {
          visitorId = result.visitorId;
          resolve(visitorId);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      reject(error);
    }
  });
};

export default getBrowserFingerprint;
