import React, { memo, useRef, useState } from "react";
import { HeaderWrapper, SearchAreaWrapper } from "./style";
import HeaderLeft from "./components/header-left";
import HeaderCenter from "./components/header-center";
import HeaderRight from "./components/header-right";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import useScrollPosition from "@/hooks/useScrollPosition";
import { ThemeProvider } from "styled-components";
import classNames from "classnames";

const AppHeader = memo(() => {
  // 是否为搜索状态
  const [isSearch, setIsSearch] = useState(false);

  const { headerConfig } = useSelector(
    (state) => ({
      headerConfig: state.main.headerConfig,
    }),
    shallowEqual
  );
  const { isFixed, topAlpha } = headerConfig;

  const { scrollY } = useScrollPosition();
  const prevY = useRef(0);
  // 如果不在搜索状态，随时记录滚动位置
  if (!isSearch) prevY.current = scrollY;
  // 如果在搜索状态，滚动位置大于30时，修改为非搜索状态
  if (isSearch && Math.abs(scrollY - prevY.current) > 30) setIsSearch(false);
  // 在最顶部时，背景设置为透明色
  const isAlpha = topAlpha && scrollY === 0;

  return (
    <ThemeProvider theme={{ $isAlpha: isAlpha }}>
      <HeaderWrapper
        $isAlpha={isAlpha}
        className={classNames({ fixed: isFixed })}
      >
        <div className="content">
          <div className="top">
            <HeaderLeft></HeaderLeft>
            <HeaderCenter
              isSearch={isAlpha || isSearch}
              searchBarClick={(e) => setIsSearch(true)}
            ></HeaderCenter>
            <HeaderRight></HeaderRight>
          </div>
          <SearchAreaWrapper $isSearch={isSearch}></SearchAreaWrapper>
        </div>
        {isSearch && (
          <div className="cover" onClick={(e) => setIsSearch(false)}></div>
        )}
      </HeaderWrapper>
    </ThemeProvider>
  );
});

export default AppHeader;
