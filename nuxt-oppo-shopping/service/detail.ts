import request from "./index";
import type { ResultType } from "./index";
export type IDetailType = "oppo" | "air" | "watch" | "tablet";
export interface IDetailInfo {
  id?: number;
  title?: string;
  productDetailss?: IProductDetail[];
}

export const getDetailInfo = (type: IDetailType) => {
  return request.get<ResultType<IDetailInfo[]>>("/oppoDetail", {
    type: type || "OPPO",
  });
};
