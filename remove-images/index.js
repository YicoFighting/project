const fs = require('fs');
const path = require('path');

const folderPath = './afterPacking'; // 打包后的文件夹路径

/**
 * 获取打包后的文件名
 * @returns
 */
const getBuildFile = () => {
  return new Promise((resolve) => {
    const used = [];
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file, index) => {
          used.push(file.replace(/\.[^.]+(?=\.[^.]+$)/, ''));
          if (index === files.length - 1) {
            resolve(used);
          }
        });
      }
    });
  });
};

/**
 * 递归打包前的文件夹,拿到每一个文件
 * @param {*} dirPath
 * @param {*} used
 */
const readDirRecursive = (dirPath, used) => {
  const files = fs.readdirSync(dirPath); // 同步读取目录下的所有文件和子目录
  files.forEach((file) => {
    const filePath = path.join(dirPath, file); // 获取文件的绝对路径
    if (fs.statSync(filePath).isDirectory()) {
      // 如果是目录，则递归读取该目录下的所有文件
      readDirRecursive(filePath, used);
    } else {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err + '文件路径:' + filePath);
        }
        // 文件大小（以字节为单位）
        const fileSizeInBytes = stats.size;
        // 在打包后的数组里不存在并且大小>4kb
        if (!used.includes(file) && Number(fileSizeInBytes) > 4096) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log('删除失败:' + err + '文件路径为:' + filePath);
            }
            console.log('删除成功' + filePath);
          });
        }
      });
    }
  });
};

/**
 * 执行函数
 */
const run = async () => {
  // 获取打包后的文件名,得到一个数组
  const used = await getBuildFile();
  // 删除打包前文件夹里的文件
  readDirRecursive('./beforePacking', used);
};

run();
