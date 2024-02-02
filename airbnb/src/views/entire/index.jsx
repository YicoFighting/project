import React, { memo, useEffect } from "react";
import EntireRooms from "./entire-rooms";
import EntirePagination from "./entire-pagination";
import { useDispatch } from "react-redux";
import { fetchRoomListAction } from "@/store/modules/entire/actionCreator";
import { changeHeaderConfig } from "@/store/modules/main";
import { EntireWrapper } from "./style";
import EntireFilter from "./entire-filter";

const Entire = memo(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRoomListAction());
    dispatch(
      changeHeaderConfig({
        isFixed: true,
        topAlpha: false,
      })
    );
  }, [dispatch]);
  return (
    <EntireWrapper>
      <EntireFilter />
      <EntireRooms />
      <EntirePagination />
    </EntireWrapper>
  );
});

export default Entire;
