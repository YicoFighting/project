const Koa = require("koa");
// 解析参数
const bodyparser = require("koa-bodyparser");
// 跨域
const cors = require("@koa/cors");

const geoip = require("geoip-lite");

// const { getData } = require("../utils/getOneImages");

const app = new Koa();

app.use(async (ctx, next) => {
  // 获取用户真实IP地址的方法取决于你的应用程序的部署方式和代理配置
  const ip =
    ctx.request.headers["x-forwarded-for"] || // 在代理服务器后面获取真实IP
    ctx.request.headers["x-real-ip"] || // nginx代理配置
    ctx.request.ip; // 直接获取IP地址

  // 获取IP地址的地理位置信息
  const location = geoip.lookup(ip);

  ctx.ip = ip;
  ctx.location = location;

  await next();
});

//路由
const useRoutes = require("../router/index");

//跨域
app.use(cors());

//解析参数
app.use(bodyparser());

//隐式绑定this
app.useRoutes = useRoutes;
//挂载路由
app.useRoutes();

//引入全局错误中间件
const errorHandle = require("./errorHandler");
//监听全局错误
app.on("error", errorHandle);

// getData();

module.exports = app;
