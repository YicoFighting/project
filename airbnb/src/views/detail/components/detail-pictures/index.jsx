import React, { memo, useState } from "react";
import { PictureWrapper } from "./style";
import { shallowEqual, useSelector } from "react-redux";
import PictureBrowser from "@/base-ui/picture-browser";

const DetailPictures = memo((props) => {
  const { detail } = useSelector(
    (state) => ({
      detail: state.detail.detail,
    }),
    shallowEqual
  );

  const [showBrowser, setShowBrowser] = useState(false);

  return (
    <PictureWrapper>
      <div className="pictures">
        <div className="left">
          <div className="item" onClick={(e) => setShowBrowser(true)}>
            <img src={detail?.picture_urls?.[0]} alt="" />
            <div className="cover"></div>
          </div>
        </div>
        <div className="right">
          {detail?.picture_urls?.slice(1, 5).map((item) => {
            return (
              <div
                className="item"
                key={item}
                onClick={(e) => setShowBrowser(true)}
              >
                <img src={item} alt="" />
                <div className="cover"></div>
              </div>
            );
          })}
        </div>
      </div>

      {!showBrowser && (
        <div className="show-btn" onClick={(e) => setShowBrowser(true)}>
          显示照片
        </div>
      )}
      {showBrowser && (
        <PictureBrowser
          pictureUrls={detail.picture_urls}
          closeClick={() => setShowBrowser(false)}
        ></PictureBrowser>
      )}
    </PictureWrapper>
  );
});

export default DetailPictures;
