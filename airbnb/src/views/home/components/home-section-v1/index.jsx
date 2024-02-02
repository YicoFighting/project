import PropTypes from "prop-types";
import React, { memo } from "react";
import { SectionV1Wrapper } from "./style";
import SectionHeader from "@/components/section-header";
import SectionFooter from "@/components/section-footer";
import SectionList from "@/components/section-list";

const HomeSectionV1 = memo((props) => {
  const { data } = props;
  return (
    <SectionV1Wrapper>
      {/* 头部 */}
      <SectionHeader
        title={data.title}
        subTitle={data.subtitle}
      ></SectionHeader>
      {/* 中间列表 */}
      <SectionList roomList={data.list} itemWidth="25%"></SectionList>
      {/* 尾部 */}
      <SectionFooter></SectionFooter>
    </SectionV1Wrapper>
  );
});

HomeSectionV1.propTypes = {
  data: PropTypes.object,
};

export default HomeSectionV1;
