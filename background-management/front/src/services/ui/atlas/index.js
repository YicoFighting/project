import nodes from "./json/nodes.json";
import links from "./json/links.json";

import newNodes from "./json/newNodes.json";
import newLinks from "./json/newLinks.json";

// 获取图谱初始节点与连线数据
const getInitialNode = () => {
  return Promise.resolve({
    nodes,
    links,
  });
};

// 获取关系扩展数据
const getExpandNode = (name) => {
  if (name == 321) {
    return Promise.resolve({
      nodes: newNodes,
      links: newLinks,
    });
  } else {
    return Promise.resolve({
      nodes: [],
      links: [],
    });
  }
};

export { getInitialNode, getExpandNode };
