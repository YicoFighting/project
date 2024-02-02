import PropTypes from "prop-types";
import React, { memo } from "react";
import { ItemWrapper } from "./style";

const LongforItem = memo((props) => {
  const { item } = props;
  return (
    <ItemWrapper>
      <div className="inner">
        <div className="item-info">
          <img className="cover" src={item.picture_url} alt="" />
          <div className="bg-cover"></div>
          <div className="info">
            <div className="city">{item.city}</div>
            <div className="price">均价 {item.price}</div>
          </div>
        </div>
      </div>
    </ItemWrapper>
  );
});

LongforItem.propTypes = {
  item: PropTypes.object,
};

export default LongforItem;
