// 文件数据库
const service = require("../service/file.service");

class FileController {
  // 保存动态图片
  async savePictureInfo(ctx, next) {
    //1、获取图片信息
    const files = ctx.req.files;

    //2、将所有文件信息保存到数据库
    for (let file of files) {
      const { originalname, mimetype, filename, size } = file;
      await service.createFile(
        originalname,
        filename,
        mimetype,
        size,
        ctx.ip,
        ctx.location
      );
    }

    //3、上传成功
    ctx.body = {
      code: 0,
      data: files,
      messgae: "动态配图上传完成",
    };
  }
}

module.exports = new FileController();
