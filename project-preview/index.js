const Koa = require("koa");
const static = require("koa-static");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");
const proxy = require("koa2-proxy-middleware");

const app = new Koa();

// 代理中间件，将所有以 /test-api 开头的请求重定向到 http://x.x.x.x:8090/test-api/
app.use(
  proxy({
    targets: {
      "/test-api/(.*)": {
        target: "http://x.x.x.x:8090/test-api/", //后端服务器地址
        changeOrigin: true,
        pathRewrite: {
          "/test-api": "",
        },
      },
    },
  })
);

// 用于处理 HTML5 历史 API 回退的中间件，此中间件将所有流量重定向到 index.html 文件，除了在 whiteList 选项中指定的路径。
app.use(
  historyApiFallback({
    whiteList: ["/test-api"],
  })
);

// 提供静态文件
app.use(static(__dirname + "/wj-gzsjzt-admin"));

// 启动服务
app.listen(5173, () => {
  console.log("吴江感知数据中台 http://localhost:5173");
});
