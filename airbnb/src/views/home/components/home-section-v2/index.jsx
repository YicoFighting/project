import PropTypes from "prop-types";
import React, { memo, useCallback, useMemo, useState } from "react";
import { SectionV2Wrapper } from "./style";
import SectionHeader from "@/components/section-header";
import SectionTabs from "@/components/section-tabs";
import SectionList from "@/components/section-list";
import SectionFooter from "@/components/section-footer";

const HomeSectionV2 = memo((props) => {
  const { data } = props;

  // 性能优化
  let tabNames = useMemo(() => {
    return data.dest_address?.map((item) => item.name);
  }, [data]);

  // tab 点击
  const initialName = Object.keys(data.dest_list)[0];
  // 只有初始化才有效
  // 1、在渲染该组件的地方进行数据的判断
  // 2、使用useEffect副作用函数(会多一次渲染)
  const [name, setName] = useState(initialName);

  // useEffect(() => {
  //   setName(data.dest_list[0]);
  // }, [data]);

  const tabClick = useCallback((index, name) => {
    setName(name);
  }, []);

  return (
    <SectionV2Wrapper>
      <div className="discount">
        <SectionHeader
          title={data.title}
          subTitle={data.subtitle}
        ></SectionHeader>
        <SectionTabs tabNames={tabNames} tabClick={tabClick}></SectionTabs>
        <SectionList
          roomList={data.dest_list?.[name]}
          itemWidth="33.33%"
        ></SectionList>
        <SectionFooter name={name}></SectionFooter>
      </div>
    </SectionV2Wrapper>
  );
});

HomeSectionV2.propTypes = {
  data: PropTypes.object,
};

export default HomeSectionV2;
