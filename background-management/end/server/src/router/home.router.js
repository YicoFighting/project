/**
 * 1、扫码登录
 * 2、注册用户直接登录,未注册用户插入数据库后登录(进行字段校验、发送验证码)
 */
const Router = require("koa-router");

const { obtainARotationChart } = require("../middleware/home.middleware");

const homeRouter = new Router({ prefix: "/home" });

homeRouter.get("/", obtainARotationChart);

module.exports = homeRouter;
