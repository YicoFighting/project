/**
 * 1、扫码登录
 * 2、注册用户直接登录,未注册用户插入数据库后登录(进行字段校验、发送验证码)
 */
const Router = require("koa-router");

const {
  getQRCode,
  scanQRCode,
  getScanQrCode,
  loginQrCode,
  login,
} = require("../middleware/auth.middleware");

// 校验工具
const schema = require("../utils/validateSchema");
// 校验规则
const { loginSchemas } = require("../schemas/auth.schema");

const authRouter = new Router({ prefix: "/auth" });

// 获取登录二维码
authRouter.get("/", getQRCode);

// 扫描二维码
authRouter.post("/", scanQRCode);

// 轮询扫码
authRouter.get("/scan", getScanQrCode);

// 获取表单验证码
authRouter.get("/login", loginQrCode);

// 表单都登陆
authRouter.post("/login", schema(loginSchemas), login);

module.exports = authRouter;
