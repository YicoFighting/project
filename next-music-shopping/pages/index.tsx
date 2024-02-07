import Head from "next/head";
import wrapper from "@/store";
import { fetchSearchSuggest } from "@/store/module/home";
import styles from "./index.module.scss";
import { FC, memo } from "react";
import { GetServerSideProps } from "next";
import {
  IHomeInfo,
  IHotProduct,
  IProduct,
  getAllproduct,
  getHotProduct_v2,
  getSwiper,
} from "@/service/home";
import TopSwiper from "@/components/top-swiper";
import TabCategory from "@/components/tab-category";
import Recommend from "@/components/recommend";
import classNames from "classnames";
import SectionTitle from "@/components/section-title";
import GridView from "@/components/grid-view";
import DigitalPanel from "@/components/digital-panel";

interface IProps {
  products?: IHotProduct[];
  hotProducts?: IProduct[];
}

const Home: FC = memo((props: IProps & IHomeInfo) => {
  const {
    banners = [],
    categorys = [],
    recommends = [],
    products = [],
    hotProducts = [],
    digitalData = [],
  } = props;
  return (
    <>
      <Head>
        <title>云音乐-商城</title>
      </Head>
      <div className={styles.home}>
        <TopSwiper banners={banners}></TopSwiper>
        <TabCategory categorys={categorys}></TabCategory>
        <Recommend recommends={recommends}></Recommend>
        <div className={classNames("wrapper", styles.content)}>
          <SectionTitle title="编辑推荐"></SectionTitle>
          <GridView products={products}></GridView>
          {/* 数据面板组件 */}
          <DigitalPanel itemData={digitalData}></DigitalPanel>
          <SectionTitle title="热门商品"></SectionTitle>
          <GridView products={hotProducts}></GridView>
        </div>
      </div>
    </>
  );
});
export default Home;
Home.displayName = "Home";

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => {
    return async (ctx) => {
      await store.dispatch(fetchSearchSuggest()); // 触发异步 actions
      // 获取轮播图数据
      const { data } = await getSwiper();
      const { data: products } = await getHotProduct_v2();
      const { data: hotProducts } = await getAllproduct();
      return {
        props: {
          banners: data.banners || [],
          categorys: data.categorys || [],
          recommends: data.recommends || [],
          products: products.hotProduct,
          hotProducts: hotProducts.allProduct,
          digitalData: data.digitalData || [],
        },
      };
    };
  });
