import { getEntireRoomList } from "@/services";
import * as actionTypes from "./constants";

export const changeCurrentPageAction = (currentPage) => ({
  type: actionTypes.CHANGE_CURRENT_PAGE,
  currentPage,
});

export const changeRoomList = (roomList) => ({
  type: actionTypes.CHANGE_ROOM_LIST,
  roomList,
});

export const changeTotalCount = (totalCount) => ({
  type: actionTypes.CHANGE_TOTAL_COUNT,
  totalCount,
});

export const changeLoadingAction = (isLoading) => ({
  type: actionTypes.CHANGE_IS_LOADING,
  isLoading,
});

export const fetchRoomListAction = (page = 0) => {
  return async (dispatch, getState) => {
    dispatch(changeCurrentPageAction(page));

    // const currentPage = getState().entire.currentPage;
    dispatch(changeLoadingAction(true));
    const res = await getEntireRoomList(page * 20);
    dispatch(changeLoadingAction(false));
    const roomList = res.list;
    const totalCount = res.totalCount;
    dispatch(changeRoomList(roomList));
    dispatch(changeTotalCount(totalCount));
  };
};
