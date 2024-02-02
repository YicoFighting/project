const rp = require("request-promise");
const fs = require("fs");

// http://172.16.1.187:8080/images/home-model/movie_00055.png
const fn = (
  urlPath = "/images/home-model/",
  baseName = "movie",
  picPath = "home",
  picLength = 149
) => {
  let index = 0;
  const errArr = [];
  const baseUrl = "http://172.16.1.187:8080" + urlPath;
  for (let i = 0; i <= picLength; i++) {
    let fileName = baseName + "_" + i.toString().padStart(5, "0") + ".png";
    const url = baseUrl + fileName;
    rp({ url, encoding: null }) // 设置 encoding 为 null，以获取二进制数据
      .then((res) => {
        fs.writeFile(
          "./public/" + picPath + "/" + fileName,
          res,
          "binary",
          (err) => {
            if (err) throw err;
            // console.log(`${fileName} 保存成功！`);
          }
        );
      })
      .catch((err) => {
        console.error(`${fileName} 保存失败`);
        errArr.push(i);
      })
      .finally(() => {
        index++;
        if (index == picLength) {
          console.log(errArr);
        }
      });
  }
};

// fn();

const readerFile = (filePath) => {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log("无法读取文件夹：", err);
      return;
    }
    const indexs = [];
    files.forEach((file) => {
      const index = file.split(".")[0].split("_")[1];
      indexs.push(index);
    });

    const reset = [];
    for (let i = 0; i <= 149; i++) {
      if (!indexs.includes(i.toString().padStart(5, "0"))) {
        reset.push(i);
      }
    }
    console.log(reset);
  });
};

readerFile("./public/home");

const resetGet = (
  arr = [],
  urlPath = "/images/home-model/",
  baseName = "movie",
  picPath = "home"
) => {
  const baseUrl = "http://172.16.1.187:8080" + urlPath;
  for (let i = 0; i < arr.length; i++) {
    let fileName = baseName + "_" + arr[i].toString().padStart(5, "0") + ".png";
    const url = baseUrl + fileName;
    rp({ url, encoding: null }) // 设置 encoding 为 null，以获取二进制数据
      .then((res) => {
        fs.writeFile(
          "./public/" + picPath + "/" + fileName,
          res,
          "binary",
          (err) => {
            if (err) throw err;
          }
        );
      })
      .catch((err) => {
        console.error(`${fileName} 保存失败`);
      });
  }
};

// resetGet([
//   0, 4, 6, 9, 20, 25, 42, 44, 45, 65, 66, 71, 77, 81, 85, 88, 92, 94, 95, 99,
//   104, 106, 109, 110, 114, 116, 118, 120, 126, 127, 130, 133, 141, 143, 144,
//   145, 146, 147,
// ]);
