const { Service } = require('../app/database');
const md5Password = require('../utils/md5Password');

class AuthService {
  //发送注册验证码
  sendRegisterCode(transporter, info) {
    return new Promise((resolve, reject) => {
      //发送邮件
      transporter.sendMail(info, (err) => {
        if (err) {
          console.log('AuthService-sendRegisterCode-error', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  //注册
  async registerService(to, password) {
    const time = new Date().getTime();
    const sql =
      'insert into user (username,email,password,role,createTime) values (?,?,?,?,?)';
    try {
      const result = await Service.execute(sql, [
        '用户' + time,
        to,
        md5Password(password),
        1,
        time,
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
  //登录
  async loginService(to, password) {
    const sql = 'select * from user where email = ? and password = ?';
    try {
      const result = await Service.execute(sql, [to, md5Password(password)]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthService();
