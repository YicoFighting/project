const UUID = require("uuid");
const QRCode = require("qrcode");
const svgCaptcha = require("svg-captcha");
const connectRedis = require("../redis");

// 获取登录的二维码
const getQRCode = async (ctx, next) => {
  try {
    // 生成二维码图片的内容
    const uuid = UUID.v4();

    // 将内容生成为二维码图片
    const qrcodeUrl = await QRCode.toDataURL(uuid);

    const redis = await connectRedis();

    // 将二维码标识存入redis  0:扫描成功 -1:等待扫码  500:二维码过期
    await redis.set(uuid, -1, {
      EX: 60 * 2,
    }); // 设置键的过期时间为 10 秒

    ctx.body = {
      code: 0,
      msg: "获取二维码成功",
      data: {
        uuid,
        qrcodeUrl,
      },
    };
  } catch (error) {
    error = new Error("获取验证码失败");
    ctx.app.emit("error", error, ctx);
  }
};

// 扫描登录的二维码
const scanQRCode = async (ctx, next) => {
  const { uuid } = ctx.request.body;

  const redis = await connectRedis();

  const noFailure = await redis.get(uuid);
  if (noFailure) {
    await redis.set(uuid, 0);

    ctx.body = {
      code: 0,
      msg: "扫码成功",
    };
  } else {
    ctx.body = {
      code: 5000,
      msg: "二维码已经失效",
    };
  }
};

// 获取扫码结果
const getScanQrCode = async (ctx, next) => {
  const { uuid } = ctx.request.query;
  try {
    const redis = await connectRedis();
    const result = await redis.get(uuid);

    ctx.body = {
      code: result ?? 500,
      msg: "获取扫码结果成功",
    };
  } catch (error) {
    error = new Error("获取扫码结果失败");
    ctx.app.emit("error", error, ctx);
  }
};

// 获取表单二维码
const loginQrCode = async (ctx, next) => {
  try {
    //随机验证码
    const captcha = svgCaptcha.create({
      // 翻转颜色
      inverse: false,
      // 字体大小
      fontSize: 36,
      // 噪声线条数
      noise: 2,
      // 宽度
      width: 80,
      // 高度
      height: 30,
    });

    const text = captcha.text;

    // 生成二维码图片的内容
    const uuid = UUID.v4();

    const redis = await connectRedis();

    // 将二维码标识存入redis
    redis.set(uuid, text, {
      EX: 60 * 60,
    });

    ctx.body = {
      code: 0,
      msg: "获取验证码成功",
      data: {
        uuid,
        svg: captcha.data,
      },
    };
  } catch (error) {
    error = new Error("获取验证码失败");
    ctx.app.emit("error", error, ctx);
  }
};

// 表单登录
const login = async (ctx, next) => {
  const { username, password, yzm, uuid } = ctx.request.body;

  const redis = await connectRedis();

  // 将二维码标识存入redis
  const redisYzm = await redis.get(uuid);

  if (
    redisYzm &&
    yzm.toString().toUpperCase() === redisYzm.toString().toUpperCase()
  ) {
    ctx.body = {
      code: 0,
      msg: "登录成功",
      token: "1234567890",
    };
  } else {
    error = new Error("验证码错误");
    ctx.app.emit("error", error, ctx);
  }

  // 1、字段校验 √
  // 2、用户名存在 对比密码和验证码
  // 3、用户名不存在 对比验证码 插入用户名和密码
};

module.exports = {
  getQRCode,
  scanQRCode,
  getScanQrCode,
  loginQrCode,
  login,
};
