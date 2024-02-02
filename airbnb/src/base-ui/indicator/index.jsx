import PropTypes from "prop-types";
import React, { createRef, memo, useEffect } from "react";
import { IndicatorWrapper } from "./style";

const Indicator = memo((props) => {
  // 当前选择
  const { selectIndex } = props;
  // 包裹item项的content盒子，所有的item项都是它的子元素
  const contentRef = createRef();

  useEffect(() => {
    // 1、获取selectIndex对应的item元素
    const selectItemEl = contentRef.current.children[selectIndex];
    // item元素距离左侧距离
    const itemElOffsetLeft = selectItemEl.offsetLeft;
    // item元素长度
    const itemWidth = selectItemEl.clientWidth;

    // 2、content的宽度
    const contentWidth = contentRef.current.clientWidth;
    // content的滚动长度
    const contentScroll = contentRef.current.scrollWidth;

    // 3、获取selectIndex要滚动的距离
    let distance = itemElOffsetLeft + itemWidth * 0.5 - contentWidth * 0.5;
    // 滚动距离小于0，重置为0
    if (distance < 0) distance = 0;
    // 滚动的最大距离
    const totalDistance = contentScroll - contentWidth;
    if (distance > totalDistance) distance = totalDistance;

    contentRef.current.style.transform = `translateX(${-distance}px)`;
  }, [contentRef, selectIndex]);
  return (
    <IndicatorWrapper>
      <div className="i-content" ref={contentRef}>
        {props.children}
      </div>
    </IndicatorWrapper>
  );
});

Indicator.propTypes = {
  selectIndex: PropTypes.number,
};

export default Indicator;
