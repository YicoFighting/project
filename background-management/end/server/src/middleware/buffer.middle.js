const xlsx = require("node-xlsx");

const generateTable = (ctx, next) => {
  try {
    const data = [];
    const title = ["序号", "预约日期"];
    data.push(title);

    //再把每一行数据加进去
    for (let i = 0; i < 100; i++) {
      const arr = [];
      arr.push(i + 1);
      arr.push(new Date());
      data.push(arr);
    }

    //由于各列数据长度不同，可以设置一下列宽
    const options = {
      sheetOptions: {
        "!cols": [{ wch: 20 }, { wch: 20 }],
      },
    };

    //生成表格
    const buffer = xlsx.build([{ name: "sheet1", data: data }], options);
    // 设置content-type请求头
    ctx.set("Content-Type", "application/vnd.openxmlformats");
    // 设置文件名信息请求头
    ctx.set(
      "Content-Disposition",
      "attachment; filename=" + encodeURIComponent("文件名") + ".xlsx"
    );
    // 文件名信息由后端返回时必须设置该请求头,否则前端拿不到Content-Disposition响应头信息
    ctx.set("Access-Control-Expose-Headers", "Content-Disposition");
    // 将buffer返回给前端
    ctx.body = buffer;
  } catch (error) {
    ctx.body = {
      code: 5000,
      message: "后端服务已去世",
    };
  }
};

module.exports = {
  generateTable,
};
