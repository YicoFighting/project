import request from "../index";

export const getHomeGoodPriceData = () => {
  return request.get({
    url: "/home/goodprice",
  });
};

export const getHomeHighScoreData = () => {
  return request.get({
    url: "/home/highscore",
  });
};

// 获取热门目的地
export function getHomeDiscountData() {
  return request.get({
    url: "/home/discount",
  });
}

// 探索精彩之地
export function getHomeHotRecommendData() {
  return request.get({
    url: "/home/hotrecommenddest",
  });
}

// Plus房源
export function getHomePlusData() {
  return request.get({
    url: "/home/plus",
  });
}

// 可能想去
export function getHomeLongforData() {
  return request.get({
    url: "/home/longfor",
  });
}
