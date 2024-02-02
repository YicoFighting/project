import React, { memo } from "react";
import AppFooter from "./components/app-footer";
import { useRoutes } from "react-router-dom";
import routes from "./router";
import AppHeader from "./components/app-header";
import useScrollTop from "./hooks/useScrollTop";

const App = memo(() => {
  // 每次重新渲染时，都让页面滚动到顶部
  useScrollTop();
  return (
    <div className="app">
      <AppHeader></AppHeader>
      <div className="page">{useRoutes(routes)}</div>
      <AppFooter></AppFooter>
    </div>
  );
});

export default App;
