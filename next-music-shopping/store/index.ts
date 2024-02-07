import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./module/home";
import { createWrapper } from "next-redux-wrapper";
const store = configureStore({
  reducer: {
    home: homeSlice,
  },
});

const wrapper = createWrapper(() => store);
export default wrapper;

// dispatch类型
export type IAppDispatch = typeof store.dispatch;
// rootState类型
export type IAppRootState = ReturnType<typeof store.getState>;
