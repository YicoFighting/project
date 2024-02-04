const fs = require('fs');
/**
 * node不能删除非空文件夹,所以需要递归删除文件夹内所有文件
 * @param {*} path 路径
 */
const deleteFolder = (path) => {
  try {
    //是否存在对应文件夹
    if (fs.existsSync(path)) {
      //读取文件夹内的文件
      fs.readdirSync(path).forEach(async (file) => {
        //当前文件路径;
        const curPath = path + '/' + file;
        //判断是否为文件夹
        const stats = fs.statSync(curPath);
        if (stats.isDirectory()) {
          //递归
          deleteFolder(curPath);
        } else {
          //删除文件
          fs.unlinkSync(curPath);
        }
      });
      //删除文件夹
      fs.rmdirSync(path);
    }
  } catch (error) {
    console.log('deleteFolder_error:', error);
  }
};

module.exports = {
  deleteFolder,
};
