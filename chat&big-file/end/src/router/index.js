const fs = require('fs');
// 添加路由
const useRoutes = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;
    // 引入路由文件
    const router = require(`./${file}`);
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
};
module.exports = useRoutes;
