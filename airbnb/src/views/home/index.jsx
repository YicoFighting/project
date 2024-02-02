import React, { memo, useEffect, useState } from "react";
import { HomeWrapper } from "./style";
import HomeBanner from "./components/HomeBanner";
import { getHomeGoodPriceData } from "@/services";
import { isEmptyObject } from "@/utils/isEmptyObject";
import HomeSectionV1 from "./components/home-section-v1";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchHomeAllDataAction } from "@/store/modules/home";
import HomeSectionV2 from "./components/home-section-v2";
import HomeSectionV3 from "./components/home-section-v3";
import HomeLongfor from "./components/home-long-for";
import { changeHeaderConfig } from "@/store/modules/main";

const Home = memo(() => {
  // 佛山高性价比房源
  const [goodPriceData, setGoodPriceData] = useState({});

  // 派发事件，发送网络请求
  const dispatch = useDispatch();
  useEffect(() => {
    getHomeGoodPriceData().then((res) => {
      setGoodPriceData(res);
    });
    dispatch(fetchHomeAllDataAction());

    // 修改头部
    dispatch(
      changeHeaderConfig({
        isFixed: true,
        topAlpha: true,
      })
    );
  }, [dispatch]);

  // 从redux中获取数据
  const {
    highScoreInfo,
    discountInfo,
    hotRecommendInfo,
    plusInfo,
    longForInfo,
  } = useSelector(
    (state) => ({
      // 佛山高分好评房源
      highScoreInfo: state.home.highScoreInfo,
      // 热门目的地
      discountInfo: state.home.discountInfo,
      // 探索精彩之地
      hotRecommendInfo: state.home.hotRecommendInfo,
      // Plus房源
      plusInfo: state.home.plusInfo,
      // 可能想去
      longForInfo: state.home.longForInfo,
    }),
    shallowEqual
  );

  return (
    <HomeWrapper>
      <HomeBanner></HomeBanner>
      <div className="content">
        {isEmptyObject(discountInfo) && (
          <HomeSectionV2 data={discountInfo}></HomeSectionV2>
        )}
        {isEmptyObject(hotRecommendInfo) && (
          <HomeSectionV2 data={hotRecommendInfo}></HomeSectionV2>
        )}
        {isEmptyObject(goodPriceData) && (
          <HomeSectionV1 data={goodPriceData}></HomeSectionV1>
        )}
        {isEmptyObject(highScoreInfo) && (
          <HomeSectionV1 data={highScoreInfo}></HomeSectionV1>
        )}
        {isEmptyObject(plusInfo) && (
          <HomeSectionV3 data={plusInfo}></HomeSectionV3>
        )}
        {isEmptyObject(longForInfo) && (
          <HomeLongfor data={longForInfo}></HomeLongfor>
        )}
      </div>
    </HomeWrapper>
  );
});

export default Home;
