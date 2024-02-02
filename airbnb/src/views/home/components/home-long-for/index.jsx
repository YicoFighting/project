import PropTypes from "prop-types";
import React, { memo } from "react";
import { LongforWrapper } from "./style";
import SectionHeader from "@/components/section-header";
import LongforItem from "@/components/long-for-item";
import ScrollView from "@/base-ui/scroll-view";

const HomeLongfor = memo((props) => {
  const { data } = props;
  return (
    <LongforWrapper>
      <SectionHeader
        title={data.title}
        subTitle={data.subtitle}
      ></SectionHeader>
      <div className="longfor-list">
        <ScrollView>
          {data.list.map((item) => {
            return <LongforItem key={item.city} item={item}></LongforItem>;
          })}
        </ScrollView>
      </div>
    </LongforWrapper>
  );
});

HomeLongfor.propTypes = {
  data: PropTypes.object,
};

export default HomeLongfor;
