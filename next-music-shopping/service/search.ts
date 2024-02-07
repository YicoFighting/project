import request from "./index";

export interface ISearchProductResult {
  code: number;
  more: boolean;
  products?: any[];
}

export interface ISearchParam {
  limit: number;
  offset: number;
  key: string;
}

// 获取搜索数据
export const getProductSearchData = (params: ISearchParam) => {
  return request.post<ISearchProductResult>(
    `/store/api/product/search`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
