import React, { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { RoomsWrapper } from "./style";
import RoomItem from "@/components/room-item";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeDetailAction } from "@/store/modules/detail";

const EntireRooms = memo((props) => {
  const { roomList, totalCount, isLoading } = useSelector(
    (state) => ({
      roomList: state.entire.roomList,
      totalCount: state.entire.totalCount,
      isLoading: state.entire.isLoading,
    }),
    shallowEqual
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemClick = useCallback(
    (item) => {
      dispatch(changeDetailAction(item));
      navigate("/detail");
    },
    [navigate, dispatch]
  );

  return (
    <RoomsWrapper>
      <div className="title">{totalCount}多处住所</div>
      <div className="list">
        {roomList.map((item) => {
          return (
            <RoomItem
              item={item}
              itemWidth="20%"
              key={item._id}
              itemClick={itemClick}
            ></RoomItem>
          );
        })}
      </div>
      {isLoading && <div className="cover"></div>}
    </RoomsWrapper>
  );
});

export default EntireRooms;
