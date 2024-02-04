import { getHomeInfo, type HomeInfoType } from "@/service/home";

export interface INavBar {
  id?: number;
  title?: string;
  type?: string;
  link?: string;
}
export interface IBanner {
  id?: number;
  picStr?: string;
  link?: string;
}
export interface IPriceInfo {
  prefix?: string;
  buyPrice?: string;
  currencyTag?: string;
}
export interface IActivity {
  type?: number;
  activityInfo?: string;
}
export interface IProductDetail {
  id?: number;
  title?: string;
  url?: string;
  priceInfo?: IPriceInfo;
  activityList?: IActivity[];
}
export interface ICategory {
  id?: number;
  picStr?: string;
  url?: string;
  title?: string;
  type?: string;
  productDetailss?: IProductDetail[];
}

export interface IHomeState {
  navbars: INavBar[];
  banners: IBanner[];
  categorys: ICategory[];
}

export const useHomeStore = defineStore("home", {
  state: (): IHomeState => {
    return {
      navbars: [],
      banners: [],
      categorys: [],
    };
  },
  actions: {
    async fetchHomeInfoData(type: HomeInfoType) {
      const { data } = await getHomeInfo(type);
      this.navbars = data.value?.data?.navbars || [];
      this.banners = data.value?.data?.banners || [];
      this.categorys = data.value?.data?.categorys || [];
    },
  },
});
