import request from "../index";

// 轮播图
const getHomeImages = () => {
  return request.get("/home");
};

export { getHomeImages };
