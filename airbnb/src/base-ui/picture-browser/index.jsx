import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import classNames from "classnames";

import Indicator from "../indicator";
import { BrowserWrapper } from "./style";

import IconClose from "@/assets/svg/icon-close";
import IconArrowLeft from "@/assets/svg/icon-arrow-left";
import IconArrowRight from "@/assets/svg/icon-arrow-right";
import IconTriangleBottom from "@/assets/svg/icon-triangle-bottom";
import IconTriangleTop from "@/assets/svg/icon-triangle-top";

const PictureBrowser = memo((props) => {
  // 图片列表 关闭事件
  const { pictureUrls = [], closeClick } = props;
  // 索引
  const [selectIndex, setSelectIndex] = useState(0);
  // 是否切换为下一张
  const [isNext, setIsNext] = useState(true);
  // 显示照片列表
  const [showList, setShowList] = useState(true);
  // 当显示图片浏览器时，滚动功能消失
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 点击关闭
  function closeBtnClickHandle() {
    if (closeClick) closeClick();
  }

  // 切换图片：更新索引
  function controlClickHandle(isNext = true) {
    let newIndex = isNext ? selectIndex + 1 : selectIndex - 1;
    if (newIndex < 0) newIndex = pictureUrls.length - 1;
    if (newIndex > pictureUrls.length - 1) newIndex = 0;
    setSelectIndex(newIndex);
    setIsNext(isNext);
  }

  // 点击照片列表
  function imgItemClickHandle(index) {
    setSelectIndex(index);
    setIsNext(index > selectIndex);
  }

  // 照片列表的切换与隐藏
  function toggleShowListHandle() {
    setShowList(!showList);
  }

  return (
    <BrowserWrapper $isNext={isNext}>
      <div className="top">
        <span className="close-btn" onClick={closeBtnClickHandle}>
          <IconClose />
        </span>
      </div>
      <div className="slider">
        <div className="control">
          <div className="btn left" onClick={(e) => controlClickHandle(false)}>
            <IconArrowLeft width="77" height="77" />
          </div>
          <div className="btn right" onClick={(e) => controlClickHandle(true)}>
            <IconArrowRight width="77" height="77" />
          </div>
        </div>
        <div className="container">
          <SwitchTransition mode="in-out">
            <CSSTransition
              key={pictureUrls[selectIndex]}
              timeout={150}
              classNames="fade"
            >
              <img src={pictureUrls[selectIndex]} alt="" />
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
      <div className="preview">
        <div className="info">
          <div className="desc">
            <div className="count">
              <span>
                {selectIndex + 1}/{pictureUrls.length}:
              </span>
              <span> room Apartment图片{selectIndex + 1}</span>
            </div>
            <div className="toggle" onClick={toggleShowListHandle}>
              隐藏照片列表
              {showList ? <IconTriangleBottom /> : <IconTriangleTop />}
            </div>
          </div>
          <div className="list" style={{ height: showList ? "67px" : "0" }}>
            <Indicator selectIndex={selectIndex}>
              {pictureUrls.map((item, index) => {
                return (
                  <div
                    className={classNames("item", {
                      active: index === selectIndex,
                    })}
                    key={item}
                    onClick={(e) => imgItemClickHandle(index)}
                  >
                    <img src={item} alt="" />
                  </div>
                );
              })}
            </Indicator>
          </div>
        </div>
      </div>
    </BrowserWrapper>
  );
});

PictureBrowser.propTypes = {
  pictureUrls: PropTypes.array,
};

export default PictureBrowser;
