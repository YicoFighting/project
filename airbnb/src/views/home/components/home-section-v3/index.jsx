import PropTypes from "prop-types";
import React, { memo } from "react";
import { SectionV3Wrapper } from "./style";
import SectionHeader from "@/components/section-header";
import RoomItem from "@/components/room-item";
import ScrollView from "@/base-ui/scroll-view";
import SectionFooter from "@/components/section-footer";

const HomeSectionV3 = memo((props) => {
  const { data } = props;
  return (
    <SectionV3Wrapper>
      <SectionHeader
        title={data.title}
        subTitle={data.subtitle}
      ></SectionHeader>
      <div className="room-list">
        <ScrollView>
          {data.list.map((item) => {
            return (
              <RoomItem item={item} itemWidth="20%" key={item.id}></RoomItem>
            );
          })}
        </ScrollView>
      </div>
      <SectionFooter name="plus" />
    </SectionV3Wrapper>
  );
});

HomeSectionV3.propTypes = {
  data: PropTypes.object,
};

export default HomeSectionV3;
