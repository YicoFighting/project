// 解析图片
const Multer = require("koa-multer");
// 上传图片位置
const PICTURE_PATH = "./upload";

// 动态配图位置
const pictureUpload = Multer({
  dest: PICTURE_PATH,
});

// 字段
const pictureHandler = pictureUpload.array("picture");

module.exports = {
  pictureHandler,
};
