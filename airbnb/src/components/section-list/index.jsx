import PropTypes from "prop-types";
import React, { memo } from "react";
import { SectionListWrapper } from "./style";
import RoomItem from "../room-item";

// 列表
const SectionList = memo((props) => {
  const { roomList = [], itemWidth } = props;
  return (
    <SectionListWrapper>
      {/* 遍历每个房间 */}
      {roomList.slice(0, 8)?.map((item) => {
        return (
          <RoomItem key={item.id} itemWidth={itemWidth} item={item}></RoomItem>
        );
      })}
    </SectionListWrapper>
  );
});

SectionList.propTypes = {
  roomList: PropTypes.array,
};

export default SectionList;
