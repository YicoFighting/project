import React, { memo, useEffect, useState } from "react";
import { RightWrapper } from "./style";
import IconGlobal from "@/assets/svg/icon-global";
import IconMenu from "@/assets/svg/icon-menu";
import IconAvatar from "@/assets/svg/icon-avatar";

const HeaderRight = memo(() => {
  const [showPanel, setShowPanel] = useState(false);
  useEffect(() => {
    const windowClick = () => {
      setShowPanel(false);
    };

    // 设置为true 代表在捕获阶段触发；点击时先捕获设置为false再设置为true
    // window捕获 => profile捕获 => profile冒泡 => window冒泡
    window.addEventListener("click", windowClick, true);
    return () => {
      window.removeEventListener("click", windowClick, true);
    };
  }, []);

  const clickProfile = () => {
    setShowPanel(!showPanel);
  };

  return (
    <RightWrapper>
      <div className="btns">
        <div className="btn">登录</div>
        <div className="btn">注册</div>
        <div className="btn">
          <IconGlobal></IconGlobal>
        </div>
      </div>
      <div className="profile" onClick={clickProfile}>
        <IconMenu></IconMenu>
        <IconAvatar></IconAvatar>

        {showPanel && (
          <div className="panel">
            <div className="top">
              <div className="item register">注册</div>
              <div className="item login">登录</div>
            </div>
            <div className="bottom">
              <div className="item">出租房源</div>
              <div className="item">开展体验</div>
              <div className="item">帮助</div>
            </div>
          </div>
        )}
      </div>
    </RightWrapper>
  );
});

export default HeaderRight;
