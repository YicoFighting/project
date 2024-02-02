importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"
);

self.onmessage = function (event) {
  const urls = event.data;
  processUrls(urls);
};

async function processUrls(urls) {
  const promises = urls.map((url, index) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(blob);
        });
      });
  });

  Promise.all(promises)
    .then((dataURLs) => {
      const zip = new JSZip();

      dataURLs.forEach((dataURL, index) => {
        const filename = `image-${index + 1}.jpg`;
        const base64Data = dataURL.split(",")[1];
        const arrayBuffer = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;
        zip.file(filename, arrayBuffer);
      });

      return zip.generateAsync({ type: "arraybuffer" });
    })
    .then((zipContent) => {
      self.postMessage({ type: "zipReady", payload: zipContent });
      self.close(); // 关闭 Web Worker
    })
    .catch((error) => {
      console.error(error);
      self.close(); // 发生错误时关闭 Web Worker
    });
}
