const { Service } = require("../database/index");
class FileService {
  // 上传动态图片
  async createFile(originalname, filename, mimetype, size, ip, location) {
    const statement = `INSERT INTO file (originalname, filename, mimetype, size,created_by_ip,created_by_address) VALUES (?,?,?,?,?,?)`;
    const [result] = await Service.execute(statement, [
      originalname,
      filename,
      mimetype,
      size,
      ip,
      location,
    ]);
    return result;
  }
}

module.exports = new FileService();
