import {
  getHomeDiscountData,
  getHomeHighScoreData,
  getHomeHotRecommendData,
  getHomeLongforData,
  getHomePlusData,
} from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchHomeAllDataAction = createAsyncThunk(
  "fetchData",
  (payload, { dispatch }) => {
    getHomeHighScoreData().then((res) => {
      dispatch(changeHighScoreInfoAction(res));
    });
    getHomeDiscountData().then((res) => {
      dispatch(changeDiscountInfoAction(res));
    });
    // 探索精彩之地
    getHomeHotRecommendData().then((res) => {
      dispatch(changeHotRecommendInfoAction(res));
    });
    // Plus房源
    getHomePlusData().then((res) => {
      dispatch(changePlusInfoAction(res));
    });
    // 可能想去
    getHomeLongforData().then((res) => {
      dispatch(changeLongforInfoAction(res));
    });
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    highScoreInfo: {},
    discountInfo: {},
    hotRecommendInfo: {},
    plusInfo: {},
    longForInfo: {},
  },
  reducers: {
    changeHighScoreInfoAction(state, { payload }) {
      state.highScoreInfo = payload;
    },
    changeDiscountInfoAction(state, { payload }) {
      state.discountInfo = payload;
    },
    changeHotRecommendInfoAction(state, { payload }) {
      state.hotRecommendInfo = payload;
    },
    changePlusInfoAction(state, { payload }) {
      state.plusInfo = payload;
    },
    changeLongforInfoAction(state, { payload }) {
      state.longForInfo = payload;
    },
  },
});

export { fetchHomeAllDataAction };

export const {
  changeHighScoreInfoAction,
  changeDiscountInfoAction,
  changeHotRecommendInfoAction,
  changePlusInfoAction,
  changeLongforInfoAction,
} = homeSlice.actions;
export default homeSlice.reducer;
