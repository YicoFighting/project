const createTransporterInstance = require('../utils/createEmailInstance');
const { register } = require('../utils/emailFormat');
const { mailUser, PRIVATE_KEY } = require('../app/config');
const { sendRegisterCode } = require('../service/auth.service');
const authService = require('../service/auth.service');
const jwt = require('jsonwebtoken');

class AuthController {
  //发送注册验证码
  async sendRegisterCtrl(ctx, next) {
    try {
      //创建nodemailer对象
      const transporter = createTransporterInstance();

      //配置nodemailer
      const info = register(mailUser, ctx.code, ctx.to);

      //发送邮件
      await sendRegisterCode(transporter, info);

      // 设置响应头
      ctx.response.type = 'image/svg+xml';

      ctx.body = {
        code: 200,
        message: '验证码发送成功',
        data: {
          svg: ctx.captcha.data,
        },
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '验证码发送失败',
      };
      console.log('AuthController-sendRegisterCtrl-error:', error);
    }
  }
  //注册
  async registerCtrl(ctx) {
    try {
      const res = await authService.registerService(ctx.to, ctx.password);
      if (res.affectedRows === 1) {
        ctx.body = {
          code: 200,
          message: '注册成功',
        };
      }
    } catch (error) {
      ctx.body = {
        code: 200,
        message: '注册失败',
      };
    }
  }
  //发送登录验证码
  sendLoginCtrl(ctx, next) {
    try {
      // 设置响应头
      ctx.response.type = 'image/svg+xml';

      ctx.body = {
        code: 200,
        message: '验证码发送成功',
        data: {
          svg: ctx.captcha.data,
        },
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '验证码发送失败',
      };
      console.log('AuthController-sendRegisterCtrl-error:', error);
    }
  }
  //登录
  async loginCtrl(ctx, next) {
    const res = await authService.loginService(ctx.to, ctx.password);
    if (res.length === 1) {
      const token = jwt.sign(
        { id: res[0].id, username: res[0].username },
        PRIVATE_KEY,
        {
          // 有效期
          expiresIn: 60 * 60 * 24,
          // 加密函数
          algorithm: 'RS256',
        }
      );
      ctx.body = {
        code: 200,
        message: '登录成功',
        data: {
          username: res[0].username,
          token,
        },
      };
    } else {
      ctx.body = {
        code: 200,
        message: '账号不存在或密码错误',
      };
    }
  }
}

module.exports = new AuthController();
