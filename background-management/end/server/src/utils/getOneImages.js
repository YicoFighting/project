const fs = require("fs");
const path = require("path");
/* 爬虫 */
const superagent = require("superagent"); //发送网络请求获取DOM
const charset = require("superagent-charset");
const cheerio = require("cheerio"); //能够像Jquery一样方便获取DOM节点
const download = require("download");
charset(superagent);

const OneUrl = "http://wufazhuce.com/";
//生成文字的图片
const text2pic = (filename, text) => {
  fs.writeFile(
    path.join(__dirname, "../../public/txt/" + filename + ".txt"),
    text,
    function (err) {
      if (err) {
        return console.log("文件写入失败！" + err.message);
      }
    }
  );
};

const getData = () => {
  superagent.get(OneUrl).end(async (err, res) => {
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
        path.join(__dirname, "../../public/images/" + filename + ".jpg"),
        await download(todayOneData["imgUrl"])
      );
      text2pic(filename, todayOneData["text"]);
    }
  });
};

module.exports = { getData };
