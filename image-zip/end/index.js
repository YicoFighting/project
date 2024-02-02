const Koa = require("koa2");
const Router = require("koa-router");
const axios = require("axios");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const cors = require("koa2-cors");
const static = require("koa-static");

const app = new Koa();
const router = new Router();

// 添加cors中间件
app.use(
  cors({
    exposeHeaders: ["Content-disposition"], // 允许访问的自定义响应头字段
  })
);

// 将 public 目录作为静态文件服务目录
app.use(static(__dirname + "/public"));

// 请求图片并压缩成zip返回给前端
router.get("/generate-images", async (ctx) => {
  try {
    const url =
      "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/gp/wallhaven-gp9god.jpg?w=2560&h=1440&fmt=jpeg";

    const urls = new Array(10).fill(url);

    const archive = archiver("zip", {
      zlib: { level: 9 }, // 设置压缩等级
    });

    // 设置响应头
    ctx.set("Content-Type", "application/octet-stream");
    ctx.set("Content-Disposition", "attachment; filename=images.zip");

    // 遍历 URL 数组并添加每个图片到压缩包中
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });

        // 根据需要设置文件名
        const filename = `image_${i}.png`;

        // 将图片数据写入压缩包
        await archive.append(response.data, { name: filename });
      } catch (e) {
        console.error(e);
      }
    }

    // 完成压缩包的创建
    archive.finalize();

    ctx.body = archive;
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 5000,
      msg: error,
    };
  }
});

// 请求图片，以流形式给前端
router.get("/download-image", async (ctx) => {
  try {
    const url =
      "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/gp/wallhaven-gp9god.jpg?w=2560&h=1440&fmt=jpeg";

    // 获取图片数据
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // 设置响应头为图片格式
    ctx.set("Content-Type", "image/jpeg");

    // 设置响应头为附件形式，并指定文件名
    ctx.set("Content-Disposition", "attachment; filename=image.jpg");

    // 将图片数据返回给客户端
    ctx.body = response.data;
  } catch (error) {
    ctx.body = {
      code: 5000,
      msg: error,
    };
  }
});

// 分段下载
router.get("/download", async (ctx) => {
  const filePath = path.join(__dirname, "./public/images.zip"); // 替换为实际文件路径
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = ctx.headers.range;
  const start = range
    ? parseInt(range.replace(/bytes=/, "").split("-")[0], 10)
    : 0;
  const end = Math.min(start + 1024 * 1024, fileSize - 1);

  ctx.set({
    "Content-Type": "application/octet-stream",
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
  });

  ctx.body = fs.createReadStream(filePath, { start, end });
});

// 以流形式传输本地的zip
router.get("/stream", async (ctx, next) => {
  const filePath = path.join(__dirname, "./public/images.zip"); // 替换为实际文件路径

  const stream = fs.createReadStream(filePath);

  const fileInfo = path.parse(filePath);
  const fileName = `${fileInfo.name}${fileInfo.ext}`;

  ctx.set("Content-disposition", `attachment; filename=${fileName}`);

  ctx.type = path.extname(filePath);

  ctx.body = stream;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
