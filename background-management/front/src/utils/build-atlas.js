// 常数 字段配置文件
const allConfig = {
  personRelationsVos: {
    source: {
      id: "fromCertNo",
      cname: "fromPersonName",
      pointType: "people",
    },
    target: {
      id: "toCertNo",
      cname: "toPersonName",
      pointType: "people",
    },
  },
  personCarRelationVos: {
    source: {
      id: "certNo",
      cname: "personName",
      pointType: "people",
    },
    target: {
      id: "plateNo",
      cname: "plateNo",
      pointType: "car",
    },
  },
  personAjRelationVos: {
    source: {
      id: "certNo",
      cname: "personName",
      pointType: "people",
    },
    target: {
      id: "ajNo",
      cname: "ajNo",
      pointType: "case",
    },
  },
};

/**
 * 分析每个配置
 * @param {*} element 每一条数据
 * @param {*} options 对应的配置
 * @returns
 */
const analysisConfiguration = (element, options) => {
  let pointId = element[options["id"]];
  // let goRoute = true;
  // 当指向的对象没有身份证号码时 使用id代替
  // 这个时候无法扩展关系和进行跳转
  if (options["id"] === "toCertNo") {
    pointId = pointId ?? element["id"];
    // goRoute = false;
  }
  // 标识
  const identifying = options["pointType"] + "_" + pointId;

  return {
    id: identifying,
    name: identifying,
    cname: element[options["cname"]],
    pointType: options["pointType"],
    pointId,
    // icon: element[options["icon"]],
    // goRoute,
  };
};

/**
 * 分析每一类的数据
 * @param {Array} data 每一类的数据
 * @param {Array} checkboxList 复选框
 * @param {*} sourceOptions 来源配置
 * @param {*} targetOptions 目标配置
 * @returns
 */
const getRelationData = (data, checkboxList, sourceOptions, targetOptions) => {
  // 节点
  const nodes = [];
  // 边
  const links = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    const source = analysisConfiguration(element, sourceOptions);

    // 要判断是否有身份证号
    const target = analysisConfiguration(element, targetOptions);

    nodes.push(source, target);

    checkboxList.value.push(element["gxlx"]);

    let pointId = element[targetOptions["id"]];
    // 当指向的对象没有身份证号码时 使用id代替
    if (targetOptions["id"] === "toCertNo") {
      pointId = pointId ?? element["id"];
    }

    const link = {
      source: sourceOptions["pointType"] + "_" + element[sourceOptions["id"]],
      target: targetOptions["pointType"] + "_" + pointId,
      label: element["gxms"] ?? element["gxlx"],
      type: element["gxlx"],
    };

    links.push(link);
  }

  return { nodes, links };
};

/**
 * 数组去重
 * @param {Array} data 需要去重的数据
 * @returns
 */
const Weightlessness = (data) => {
  const repeat = [];
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const json = JSON.stringify(item);

    if (!repeat.includes(json)) {
      repeat.push(json);
      newData.push(item);
    }
  }
  return newData;
};

/**
 *
 * @param {Object} graphData 关系数据
 * @param {Array} checkboxList 复选框数据
 */
const getNodeLinks = async (graphData, checkboxList) => {
  const allNodes = [];
  const allLinks = [];

  const allKeys = Object.keys(allConfig);
  for (let i = 0; i < allKeys.length; i++) {
    // 得到人人关系
    const { nodes, links } = await getRelationData(
      graphData[allKeys[i]],
      checkboxList,
      allConfig[allKeys[i]].source,
      allConfig[allKeys[i]].target
    );

    allNodes.push(...nodes);
    allLinks.push(...links);
  }

  const nodes = await Weightlessness(allNodes);
  const links = await Weightlessness(allLinks);

  checkboxList.value = await Weightlessness(checkboxList.value);

  return { nodes, links };
};

const turnIntoACircle = function (imgSrc, R = 35) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "";
    img.onload = function () {
      // 半径
      const radius = R;
      // 直径
      const side = R * 2;
      // canvas的长和宽
      canvas.width = side;
      canvas.height = side;
      // 默认长宽比为1
      const canvasRatio = 1;
      // 图片长度和宽度
      const imageWidth = img.width;
      const imageHeight = img.height;
      const imageRatio = imageWidth / imageHeight;
      // 修改纵横比
      let sx, sy, sHeight, sWidth;
      if (imageRatio < canvasRatio) {
        sWidth = imageWidth;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = (imageHeight - sHeight) / 2;
      } else {
        sHeight = imageHeight;
        sWidth = imageHeight * canvasRatio;
        sy = 0;
        sx = (imageWidth - sWidth) / 2;
      }

      context.clearRect(0, 0, side, side);
      context.save();
      context.beginPath();
      context.arc(radius, radius, radius, 0, 2 * Math.PI);
      context.clip();
      context.drawImage(img, sx, sy, sWidth, sHeight, 12, 10, 46, 48);
      context.restore();
      resolve(canvas.toDataURL("image/png", 1));
    };
    img.src = imgSrc;
  });
};

export { getNodeLinks, turnIntoACircle };
