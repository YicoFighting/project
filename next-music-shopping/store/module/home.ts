import { ISearchSuggest, getSearchSuggest } from "@/service/home";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface IHomeInitialState {
  count: number;
  navbar: ISearchSuggest;
}

const homeSlice = createSlice({
  name: "home",
  initialState: {
    count: 100,
    navbar: {},
  } as IHomeInitialState,
  reducers: {
    increment(state, { payload }) {
      state.count += payload;
    },
  },
  extraReducers: (builder) => {
    // Hydrate的操作，保证服务端和客户端数据的一致性
    builder
      .addCase(HYDRATE, (state, action: any) => {
        // state => initialState
        // action.payload => rootState
        return {
          ...state,
          ...action.payload.home,
        };
      })
      .addCase(fetchSearchSuggest.fulfilled, (state, { payload }) => {
        state.navbar = payload;
      });
  },
});

export const fetchSearchSuggest = createAsyncThunk(
  "fetchSearchSuggest",
  async () => {
    const { data } = await getSearchSuggest();
    return data;
  }
);

export const { increment } = homeSlice.actions;
export default homeSlice.reducer;
