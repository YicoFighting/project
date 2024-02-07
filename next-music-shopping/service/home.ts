import request, { IResultData } from "./index";

export interface ISearchSuggest {
  id: string;
  defaultKey: string;
  configKey: any[];
}
export interface Ibanner {
  id: number;
  picStr?: string;
  backendPicStr?: string;
}

export interface ICategory {
  cid: number;
  picStr?: string;
  title?: string;
  tabIndex?: number;
  count?: number;
  desc?: string;
  type?: number;
}

export interface IRecommend {
  id: number;
  picStr?: string;
  title?: string;
}

export interface IHomeInfo {
  banners?: Ibanner[];
  categorys?: ICategory[];
  recommends?: IRecommend[];
  digitalData?: any;
}

export interface IProduct {
  id: number;
  name?: string;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  originalCost?: number;
  couponLabelDesc?: string;
  coverUrl?: string;
}

export interface IHotProduct {
  id: number;
  products?: IProduct;
}

export interface IHotProductV2 {
  count?: number;
  hasMore?: boolean;
  hotProduct?: IHotProduct[];
}

export interface IAllProduct {
  count?: number;
  allProduct?: IProduct[];
}

// 获取搜索建议
export const getSearchSuggest = () => {
  return request.get<IResultData<ISearchSuggest>>("/searchSuggest/get");
};

// 获取轮播图数据
export const getSwiper = () => {
  return request.get<IResultData<IHomeInfo>>("/home/info");
};

// 获取编辑推荐的数据
export const getHotProduct_v2 = () => {
  return request.get<IResultData<IHotProductV2>>("/hotproduct_v2/gets");
};

// 获取热门推荐数据
export const getAllproduct = () => {
  return request.get<IResultData<IAllProduct>>("/allproduct/gets");
};
