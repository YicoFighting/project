// 示例数据
const flatList = [
  { id: 1, name: "华为总公司", parentId: null },
  { id: 2, name: "华为系列", parentId: 1 },
  { id: 3, name: "荣耀系列", parentId: 1 },
  { id: 4, name: "华为手机", parentId: 2 },
  { id: 5, name: "华为耳机", parentId: 2 },
  { id: 6, name: "华为平板", parentId: 2 },
  { id: 7, name: "荣耀手机", parentId: 3 },
  { id: 8, name: "荣耀耳机", parentId: 3 },
  { id: 9, name: "荣耀平板", parentId: 3 },

  { id: 10, name: "小米总公司", parentId: null },
  { id: 11, name: "小米系列", parentId: 10 },
  { id: 12, name: "红米系列", parentId: 10 },
  { id: 13, name: "小米手机", parentId: 11 },
  { id: 14, name: "小米耳机", parentId: 11 },
  { id: 15, name: "小米平板", parentId: 11 },
  { id: 16, name: "红米手机", parentId: 12 },
  { id: 17, name: "红米耳机", parentId: 12 },
  { id: 18, name: "红米平板", parentId: 12 },
];

const array2Tree = (
  list,
  idName = "id",
  parentName = "parentId",
  childrenName = "children"
) => {
  const obj = {};
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const id = item[idName];
    const parentId = item[parentName];

    obj[id] = obj[id] ? { ...item, ...obj[id] } : item;

    const treeItem = obj[id];

    if (!parentId) {
      result.push(treeItem);
    } else {
      if (!obj[parentId]) {
        obj[parentId] = {};
      }

      if (!obj[parentId][childrenName]) {
        obj[parentId][childrenName] = [];
      }

      obj[parentId][childrenName].push(treeItem);
    }
  }

  return result;
};

export const getTreeData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(array2Tree(flatList));
    }, 2000);
  });
};
