import request, { IResultData } from ".";
import { IProduct } from "./home";

export interface IDetailPageInfo {
  id?: number;
  webPic?: string;
  products?: IProduct[];
}

export const getDetailPageInfo = (id: string) => {
  return request.get<IResultData<IDetailPageInfo>>(
    "/special/getdetail?specialTopicId=" + id
  );
};
