/**
 * base64转blob
 * @param {*} base64Data
 */
const base64ToBlob = (base64Data) => {
  let arr = base64Data.split(','),
    fileType = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    l = bstr.length,
    u8Arr = new Uint8Array(l);

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8Arr], {
    type: fileType,
  });
};

/**
 * 将blob转化为可展示的url
 * @param {*} base64Data
 */
export default (base64Data) =>
  window.URL.createObjectURL(base64ToBlob(base64Data));
