import { optimize } from "svgo/dist/svgo.browser.js";
import Compressor from "compressorjs";
import UPNG from "upng-js";

const handleSVG = (file) => {
  return new Promise((resovle, reject) => {
    try {
      // 创建一个FileReader对象来读取SVG文件
      const reader = new FileReader();
      // 读取SVG文件
      reader.readAsText(file);
      // 当SVG文件加载完成后执行的回调函数
      reader.onload = async (event) => {
        // 获取SVG文件的内容
        const svgContent = event.target.result;
        // 使用SVGO实例来压缩SVG图片
        const { data: compressedSvg } = await optimize(svgContent);
        // 将压缩后的SVG内容转换为Blob对象
        const blob = new Blob([compressedSvg], { type: "image/svg+xml" });
        // 使用File constructor创建一个File对象
        const newImgFile = new File([blob], file.name, {
          type: "image/svg+xml",
          lastModified: Date.now(),
        });
        // 压缩后的SVG图片作为File对象
        resovle(newImgFile);
      };
    } catch (error) {
      reject(error);
    }
  });
};

const handlePNGandWebp = (file) => {
  return new Promise((resolve, reject) => {
    try {
      new Compressor(file, {
        quality: 0.6,
        convertTypes: ["image/png", "image/webp", "image/jpeg"],
        success: (blob) => {
          const newImgFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(newImgFile);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handlePNG = (file) => {
  return new Promise((resovle, reject) => {
    try {
      // 创建一个FileReader对象来读取SVG文件
      const reader = new FileReader();
      // 读取SVG文件
      reader.readAsDataURL(file);
      // 当SVG文件加载完成后执行的回调函数
      reader.onload = async (event) => {
        const url = event.target.result;
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas"); // 创建 canvas 元素
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const blob = UPNG.encode(
            [data.buffer],
            canvas.width,
            canvas.height,
            0.5
          );
          const newImgFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          // 压缩后的SVG图片作为File对象
          resovle(newImgFile);
        };
      };
    } catch (error) {
      reject(error);
    }
  });
};

const imageFunc = {
  "image/svg+xml": handleSVG,
  "image/jpeg": handlePNGandWebp,
  "image/webp": handlePNGandWebp,
  "image/png": handlePNG,
};

const compression = (file) => {
  return new Promise(async (resolve, reject) => {
    const func = imageFunc[file.type];
    if (func) {
      try {
        const result = await func(file);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    } else {
      reject("只允许上传webp/png/jpeg/svg类型的图片");
    }
  });
};

export default compression;
