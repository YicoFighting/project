const Router = require("koa-router");
const { pictureHandler } = require("../middleware/file.middleware");
const { savePictureInfo } = require("../controller/file.controller");

const fileRouter = new Router({ prefix: "/upload" });

fileRouter.post("/", pictureHandler, savePictureInfo);

module.exports = fileRouter;
