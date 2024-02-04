/** 清理碎片 */
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

/**
 * 定时任务
 * @param {*} UPLOAD_DIR 文件夹
 */
const run = (UPLOAD_DIR = "./excel/") => {
  /** 每5秒扫描一次 */
  schedule.scheduleJob("0 0/1 * * * ?", () => {
    // console.log('开始扫描...' + new Date());
    scanFolder(UPLOAD_DIR);
  });
};

/**
 * 扫描文件夹
 * @param {*} dir 文件夹路径
 */
const scanFolder = (dir) => {
  /** 读取文件夹 */
  const files = fs.readdirSync(dir);

  /** 遍历文件夹内容 */
  files.forEach((file) => {
    /** 文件路径 */
    const fileDir = path.resolve(dir, file);
    //判断是否为文件夹
    const stats = fs.statSync(fileDir);
    if (stats.isDirectory()) {
      //递归
      scanFolder(fileDir);
      //删除文件夹
      //   fs.rmdirSync(fileDir);
      removeFileOrFolder(fileDir, stats, true);
    } else {
      //删除文件
      //   fs.unlinkSync(fileDir);
      removeFileOrFolder(fileDir, stats);
    }
  });
};

/**
 * 删除文件或文件夹
 * @param {*} fileDir 文件或文件夹路径
 * @param {*} stats 包含文件信息
 * @param {*} isFolder true代表是文件夹
 */
const removeFileOrFolder = (fileDir, stats, isFolder = false) => {
  /** 当前时间 */
  const now = new Date().getTime();
  /** 距离上次修改时间 */
  const offst = now - stats.ctimeMs;
  /** 大于60s的碎片 */
  if (offst > 1000 * 60) {
    console.log(`${fileDir}已过期,正在清理...`);
    /** 删除文件夹或文件 */
    isFolder ? fs.rmdirSync(fileDir) : fs.unlinkSync(fileDir);
  }
};

module.exports = { run };
