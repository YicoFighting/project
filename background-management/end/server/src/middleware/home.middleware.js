const fs = require("fs");
const path = require("path");
//导入后端运行端口
const { APP_PORT } = require("../app/config");

// 获取轮播图
const obtainARotationChart = (ctx, next) => {
  try {
    const readDir = fs.readdirSync(path.join(__dirname, "../../public/txt/"));
    const data = [];
    readDir.forEach((dir) => {
      const filename = dir.split(".")[0];
      const text = fs.readFileSync(
        path.join(__dirname, "../../public/txt/" + dir),
        "utf-8"
      );
      data.push({
        time: filename,
        text: text,
        src: "http://localhost:" + APP_PORT + "/images/" + filename + ".jpg",
      });
    });

    ctx.body = {
      code: 0,
      msg: "获取轮播图成功",
      data,
    };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      code: 5000,
      msg: error?.message ?? "获取轮播图失败",
    };
  }
};

module.exports = {
  obtainARotationChart,
};
