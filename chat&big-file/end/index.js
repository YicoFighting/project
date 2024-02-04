/* 爬虫 */
const superagent = require("superagent"); //发送网络请求获取DOM
const charset = require("superagent-charset");
const cheerio = require("cheerio"); //能够像Jquery一样方便获取DOM节点
const download = require("download");
const fs = require("fs");
const path = require("path");
const static = require("koa-static");
const TextToSVG = require("text-to-svg");
const ejs = require("ejs"); //ejs模版引擎
const schedule = require("node-schedule");
const xlsx = require("node-xlsx");
charset(superagent);
/* 爬虫 */
/* WebSocket */
const http = require("http");
const ws = require("ws");
const WebSocket = require("./src/utils/websocket"); //引入封装的ws模块
/* WebSocket */
const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("koa-router");
const { koaBody } = require("koa-body");
const jwt = require("jsonwebtoken");
//ip
const searcher = require("node-ip2region").create();
const {
  resolutionRes,
  encryption,
  generateMixed,
} = require("./src/utils/resolution");
const { jwtPbulic, jwtPrivate, mockRoutes } = require("./src/utils/constant");
const multer = require("@koa/multer");
const { accessLogger, logger, loginLog } = require("./src/log/logger");
// 添加路由
const useRoutes = require("./src/router/index");
//删除文件夹
const { deleteFolder } = require("./src/utils/deleteFolder");
//扫描文件碎片
const { run } = require("./src/utils/debrisCleaning");

run();

const uploadAvatar = multer({ dest: "./public/uploads/avatar" });
const uploadPicture = multer({ dest: "./public/uploads/picture" });
const uploadFile = multer();

const PORT = 8080;
const app = new Koa();
const router = new Router();

app.use(accessLogger());
//设置跨域参数
app.use(cors({ origin: "*" }));
//解析body
// app.use(
//   koaBody({
//     multipart: true,
//   })
// );
app.use(koaBody());
//路由
app.use(router.routes());
app.use(router.allowedMethods());
// 隐式绑定app
useRoutes(app);

//静态资源托管
app.use(static(path.join(__dirname, "./public")));

/* ---- */
//字体路径
const fontPath = path.join(__dirname, "./public/fonts/douyu.otf");
const textToSVG = TextToSVG.loadSync(fontPath);
const OneUrl = "http://wufazhuce.com/";
const getData = () => {
  //生成文字的图片
  const text2pic = (filename, text) => {
    const attributes = { fill: "black" };
    const options = {
      x: 0,
      y: 0,
      fontSize: 20,
      anchor: "top",
      attributes: attributes,
    };
    const svg = textToSVG.getSVG(text, options);
    fs.writeFile("./public/svg/" + filename + ".svg", svg, function (err) {
      if (err) {
        return console.log("文件写入失败！" + err.message);
      }
    });
    fs.writeFile("./public/txt/" + filename + ".txt", text, function (err) {
      if (err) {
        return console.log("文件写入失败！" + err.message);
      }
    });
  };
  superagent.get(OneUrl).end(async function (err, res) {
    if (err) {
      console.log(err);
    }
    let $ = cheerio.load(res.text);
    let selectItem = $("#carousel-one .carousel-inner .item");
    for (let index = 0; index < selectItem.length; index++) {
      let todayOne = selectItem[index];
      let todayOneData = {
        imgUrl: $(todayOne).find(".fp-one-imagen").attr("src"),
        titulo: $(todayOne)
          .find(".titulo")
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        dom: $(todayOne)
          .find(".dom")
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
        may: $(todayOne).find(".may").text().replace(" ", "-"),
        text: $(todayOne)
          .find(".fp-one-cita")
          .text()
          .replace(/(^\s*)|(\s*$)/g, ""),
      };
      const filename = todayOneData["dom"] + "-" + todayOneData["may"];
      //下载代码
      fs.writeFileSync(
        "./public/images/" + filename + ".jpg",
        await download(todayOneData["imgUrl"])
      );
      text2pic(filename, todayOneData["text"]);
    }
  });
};
//每天12点执行
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 0;
rule.minute = 0;
schedule.scheduleJob(rule, function () {
  console.log("执行任务" + new Date());
  getData();
});
/* ---- */

const getClientIP = (ctx) => {
  let ip =
    ctx.headers["x-forwarded-for"] || // 判断是否有反向代理 IP
    ctx.ip ||
    ctx.connection.remoteAddress || // 判断 connection 的远程 IP
    ctx.socket.remoteAddress || // 判断后端的 socket 的 IP
    ctx.connection.socket.remoteAddress ||
    "";
  if (ip) {
    ip = ip.replace("::ffff:", "");
  }

  return ip;
};

const server = http.createServer(app.callback());
const wss = new ws.Server({
  // 同一个端口监听不同的服务
  server,
});
WebSocket(wss, app);

//文件中转
router.get("/", (ctx) => {
  const readDir = fs.readdirSync("./public/images/");
  const template = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, "./public/index.ejs"), "utf8")
  );
  const html = template({ data: readDir, port: PORT });
  ctx.set("Content-Type", "text/html");
  ctx.body = html;
});

//登录
router.post("/login", (ctx) => {
  const { key, params } = ctx.request.body;
  const { aesKey, data } = resolutionRes(key, params);
  const { username, password } = data;
  //返回给前端的数据
  const token = jwt.sign({ username }, jwtPrivate, {
    // 有效期
    expiresIn: 60 * 60 * 24,
    // 加密函数
    algorithm: "RS256",
  });
  const res = {
    token: "Bearer " + token,
  };
  const ip = getClientIP(ctx);
  try {
    // const address = searcher
    //   .btreeSearchSync(ip)
    //   ["region"].replaceAll("|0|", "-");
    loginLog.info(
      JSON.stringify({
        username,
        time: new Date(),
        ip,
        // address,
        status: 1,
        info: "用户登录",
      })
    );
    ctx.body = encryption(aesKey, res);
  } catch (error) {
    console.log("error", error);
  }
});

//动态路由
router.get("/userInfo", (ctx) => {
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: "请登录!",
    };
  } else {
    // 替换
    const token = authorization.replace("Bearer ", "");
    // 验证密码 解密
    try {
      const result = jwt.verify(token, jwtPbulic, {
        algorithms: ["RS256"],
        maxAge: 60 * 60 * 24 * 30,
      });
      const ip = getClientIP(ctx);
      // const address = searcher
      //   .btreeSearchSync(ip)
      //   ["region"].replaceAll("|0|", "-");
      logger.info(
        JSON.stringify({
          username: result["username"],
          time: new Date(),
          ip,
          // address,
          status: 1,
          info: "获取动态路由",
        })
      );
      const res = {
        username: result["username"],
        menu: mockRoutes,
      };
      ctx.body = encryption(generateMixed(10), res);
    } catch (err) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: "请登录!",
      };
    }
  }
});

//展示图片
router.get("/image/:name", (ctx) => {
  const { name } = ctx.params;
  ctx.response.set("content-type", "image/jpeg");
  ctx.body = fs.createReadStream(
    path.join(__dirname, "./public/images/" + name + ".jpg")
  );
});

//展示用户的ip
router.get("/ip", (ctx) => {
  try {
    ctx.body = searcher.btreeSearchSync(ctx.ip);
  } catch (error) {
    ctx.body = "ip地址有误";
  }
});

//轮播图
router.get("/carousel", async (ctx) => {
  const readDir = fs.readdirSync("./public/txt/");
  const data = [];
  readDir.forEach((dir) => {
    const filename = dir.split(".")[0];
    const text = fs.readFileSync(
      path.join(__dirname, "./public/txt/" + dir),
      "utf-8"
    );
    data.push({
      time: filename,
      text: text,
      src: "http://localhost:" + PORT + "/image/" + filename,
    });
  });
  // ctx.body = encryption(generateMixed(10), data);
  ctx.body = data;
});

//上传图片
router.post("/upload-img", uploadAvatar.single("file"), (ctx) => {
  const file = ctx.file;
  const extname = path.extname(file.originalname);
  const filename = file.originalname.split(extname)[0];
  try {
    fs.rename(
      file.path,
      file.destination + "/" + filename + "_" + new Date() * 1 + extname,
      (err) => {
        if (err) {
          throw new Error("文件重命名错误");
        }
      }
    );
    ctx.body = "文件上传成功";
  } catch (error) {
    ctx.body = error;
  }
});

//上传头像
router.post("/avatar", uploadAvatar.single("avatar"), (ctx) => {
  const file = ctx.file;
  const extname = path.extname(file.originalname);
  const filename = file.originalname.split(extname)[0];
  try {
    fs.rename(
      file.path,
      file.destination + "/" + filename + "_" + new Date() * 1 + extname,
      (err) => {
        if (err) {
          throw new Error("文件重命名错误");
        }
      }
    );
    ctx.body = "文件上传成功";
  } catch (error) {
    ctx.body = error;
  }
});

//上传轮播图
router.post("/picture", uploadPicture.array("photos", 9), (ctx) => {
  try {
    const files = ctx.files;
    files.forEach((file) => {
      const extname = path.extname(file.originalname);
      const filename = file.originalname.split(extname)[0];
      fs.rename(
        file.path,
        file.destination + "/" + filename + "_" + new Date() * 1 + extname,
        (err) => {
          if (err) {
            throw new Error("文件重命名错误");
          }
        }
      );
    });
    ctx.body = "图片上传成功";
  } catch (error) {
    ctx.body = error;
  }
});

/** 上传切片文件 */
router.post("/files", uploadFile.single("file"), (ctx) => {
  /** buffer流 */
  let { buffer } = ctx.file;
  /** 文件名、切片名 */
  let { fileName, fragmentName } = ctx.request.body;
  /** 处理名称为汉字的情况 */
  // fileName = Buffer.from(fileName, 'latin1').toString('utf8');
  // fragmentName = Buffer.from(fragmentName, 'latin1').toString('utf8');
  /** 是否存在对应路径 */
  const savePath = "./public/uploads/file/" + fileName + "/";
  const havePath = fs.existsSync(savePath);
  /** 不存在对应路径时需要创建对应路径 */
  if (!havePath) {
    /** 创建对应路径 */
    fs.mkdirSync(savePath);
  }
  /** 往当前路径写入文件 */
  fs.writeFileSync(savePath + fragmentName, buffer);
  ctx.body = {
    code: 0,
    msg: "上传成功",
  };
});

//合并文件
router.post("/mergeFile", (ctx) => {
  const { fileName } = ctx.request.body;
  const originName = fileName.substring(0, fileName.lastIndexOf("."));
  const savePath = "./public/uploads/file/";
  const files = fs.readdirSync(savePath + originName);
  const originFile = savePath + fileName;
  try {
    files
      .sort((a, b) => {
        //匹配_数字
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      })
      .forEach((item, index) => {
        fs.appendFileSync(
          originFile,
          fs.readFileSync(savePath + originName + "/" + item)
        );
        if (index == files.length - 1) {
          deleteFolder(savePath + originName);
        }
      });
  } catch (error) {
    console.log("merge_error:", error);
  }
  ctx.body = {
    code: 0,
    msg: "合并完成",
  };
});

/** 慢策略网络请求 */
router.post("/fileStrategy", uploadFile.single("chunk"), (ctx) => {
  /** buffer流 */
  let { buffer } = ctx.file;
  /** 切片名、原始文件名、文件hash值、切片大小 */
  let { chunkName, fileName, fileHash, size } = ctx.request.body;
  /** 是否存在对应路径 */
  const savePath = "./public/uploads/file/" + fileHash + "/";
  const havePath = fs.existsSync(savePath);
  /** 不存在对应路径时需要创建对应路径 */
  if (!havePath) {
    /** 创建对应路径 */
    fs.mkdirSync(savePath);
  }
  /** 往当前路径写入文件 */
  fs.writeFileSync(savePath + chunkName, buffer);
  ctx.body = {
    code: 0,
    fileName,
    size,
    msg: "上传成功",
  };
});

/** 慢策略网络请求(合并) */
router.post("/mergeStrategy", (ctx) => {
  /** hash、原始文件名、hash+后缀 */
  const { hash, originFileName, fileName } = ctx.request.body;
  /** 拿到临时文件夹并读取 */
  const savePath = "./public/uploads/file/";
  /** 临时文件夹中的切片 */
  const files = fs.readdirSync(savePath + hash);
  /** 在对应文件夹内生成 */
  const originFile = savePath + fileName;
  try {
    files
      .sort((a, b) => {
        //匹配_数字
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      })
      .forEach((item) => {
        fs.appendFileSync(
          originFile,
          fs.readFileSync(savePath + hash + "/" + item)
        );
        // if (index == files.length - 1) {
        //   deleteFolder(savePath + hash);
        // }
      });
    deleteFolder(savePath + hash);
  } catch (error) {
    console.log("merge_error:", error);
  }
  ctx.body = {
    code: 0,
    msg: "合并完成",
  };
});

/** 将数据生成excel流 */
router.post("/exportExcel", (ctx) => {
  const headers = ["id", "username", "phone", "sex", "address", "createTime"];
  const dataOne = [
    [1, "刘", "17779755710", "男", "江苏省", "2022-01-19 16:50:00"],
    [2, "智", "17779755710", "男", "苏州市", "2022-01-19 16:50:30"],
    [3, "慧", "17779755710", "男", "姑苏区", "2022-01-19 16:50:59"],
  ];
  const dataTwo = [
    [1, "肖", "17779755710", "女", "江西省", "2022-01-19 16:50:00"],
    [2, "紫", "17779755710", "女", "赣州市", "2022-01-19 16:50:30"],
    [3, "嫣", "17779755710", "女", "兴国县", "2022-01-19 16:50:59"],
  ];

  const sheetOptions = {
    "!cols": [
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 22 },
    ],
  };

  const buffer = xlsx.build(
    [
      { name: "夫", data: [headers, ...dataOne] },
      { name: "妻", data: [headers, ...dataTwo] },
    ],
    { sheetOptions }
  );
  const time = new Date().getTime();
  ctx.set(
    "Content-Disposition",
    `attachment;filename=${encodeURIComponent("测试文件_")}${time}.xlsx`
  );
  fs.writeFileSync(`./excel/测试文件_${time}.xlsx`, buffer, { flag: "w" });

  const workSheetsFromBuffer = xlsx.parse(
    fs.readFileSync(`./excel/测试文件_${time}.xlsx`)
  );
  // Parse a file
  const workSheetsFromFile = xlsx.parse(`./excel/测试文件_${time}.xlsx`);
  workSheetsFromBuffer.forEach((sheet) => {
    console.log(sheet["data"]);
  });
  console.log(workSheetsFromFile);
  ctx.body = buffer;
});

getData();

server.listen(PORT, () => {
  console.log("The service run in http://localhost:" + PORT);
});
