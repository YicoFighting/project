import { createSlice } from "@reduxjs/toolkit";

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    detail: {},
  },
  reducers: {
    changeDetailAction(state, { payload }) {
      state.detail = payload;
    },
  },
});

export const { changeDetailAction } = detailSlice.actions;
export default detailSlice.reducer;
