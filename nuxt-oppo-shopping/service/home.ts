import request from "./index";
import type { ResultType } from "./index";
import type { IHomeState } from "@/stores/home";
export type HomeInfoType = "OPPO" | "onePlus" | "intelligent";

export const getHomeInfo = (type: HomeInfoType) => {
  return request.get<ResultType<IHomeState>>("/home/info", {
    type: type || "OPPO",
  });
};
