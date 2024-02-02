import PropTypes from "prop-types";
import React, { createRef, memo, useState } from "react";
import { ItemWrapper } from "./style";
import Rating from "@mui/material/Rating";
import { Carousel } from "antd";
import IconArrowLeft from "@/assets/svg/icon-arrow-left";
import IconArrowRight from "@/assets/svg/icon-arrow-right";
import Indicator from "@/base-ui/indicator";
import classNames from "classnames";

const RoomItem = memo((props) => {
  const { item, itemWidth = "25%", itemClick } = props;
  const [selectIndex, setSelectIndex] = useState(0);
  const swiperRef = createRef();
  const clickBtn = (isRight = true, e) => {
    isRight ? swiperRef.current.next() : swiperRef.current.prev();

    let newIndex = isRight ? selectIndex + 1 : selectIndex - 1;
    const length = item.picture_urls.length;
    if (newIndex < 0) newIndex = length - 1;
    if (newIndex > length - 1) newIndex = 0;
    setSelectIndex(newIndex);

    e.stopPropagation();
  };

  const pictureElement = (
    <div className="cover">
      <img src={item.picture_url} alt="" />
    </div>
  );

  const sliderElement = (
    <div className="swiper">
      {/* 左右控制条 */}
      <div className="control">
        <div className="btn left" onClick={(e) => clickBtn(false, e)}>
          <IconArrowLeft width="30" height="30"></IconArrowLeft>
        </div>
        <div className="btn right" onClick={(e) => clickBtn(true, e)}>
          <IconArrowRight width="30" height="30"></IconArrowRight>
        </div>
      </div>

      {/* 中间小点 */}
      <div className="indicator">
        <Indicator selectIndex={selectIndex}>
          {item?.picture_urls?.map((url, index) => {
            return (
              <div className="item" key={url}>
                <span
                  className={classNames("dot", {
                    active: selectIndex === index,
                  })}
                ></span>
              </div>
            );
          })}
        </Indicator>
      </div>

      {/* 底部轮播图 */}
      <Carousel dots={false} ref={swiperRef}>
        {item?.picture_urls?.map((url) => {
          return (
            <div className="cover" key={url}>
              <img src={url} alt="" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );

  const itemClickHandle = () => {
    if (itemClick) {
      itemClick(item);
    }
  };

  return (
    <ItemWrapper
      color={item?.verify_info?.text_color || "#39576a"}
      $itemwidth={itemWidth}
      onClick={itemClickHandle}
    >
      <div className="inner">
        {!item.picture_urls ? pictureElement : sliderElement}

        <div className="desc">{item?.verify_info?.messages.join(" . ")}</div>
        <div className="name">{item.name}</div>
        <div className="price">¥{item.price}/晚</div>

        <div className="bottom">
          <Rating
            value={item?.stae_rating ?? 5}
            precision={0.1}
            readOnly
            size="small"
            sx={{ fontSize: "12px", color: "#00848A" }}
          />
          <span className="count">{item?.reviews_count}</span>
          {item?.bottom_info?.content && (
            <span className="extra">.{item?.bottom_info?.content}</span>
          )}
        </div>
      </div>
    </ItemWrapper>
  );
});

RoomItem.propTypes = {
  item: PropTypes.object,
};

export default RoomItem;
