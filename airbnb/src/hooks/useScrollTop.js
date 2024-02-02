import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollTop() {
  const location = useLocation();
  // 路由地址改变时，即页面跳转后，滚动至头部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
}
