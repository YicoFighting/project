import { memo } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import Link from "next/link";
import HeaderSearch from "../header-search";
import { shallowEqual, useSelector } from "react-redux";
import { IAppRootState } from "@/store";

const NavBar = memo(function () {
  const { navbar, count } = useSelector((rootState: IAppRootState) => {
    return {
      navbar: rootState.home.navbar,
      count: rootState.home.count,
    };
  }, shallowEqual);
  return (
    <div className={styles.navbar}>
      <div className={classNames("wrapper", styles.content)}>
        <div className={styles["content-left"]}>
          <Link href="/" className={styles.logo}></Link>
          {/* 用于爬虫，使用样式让它不可见 */}
          <h1 className={styles.title}>云音乐商城-音乐购有趣</h1>
        </div>
        <div className={styles["content-right"]}>
          {/* <div className={styles["right-search"]}>search</div> */}
          <HeaderSearch data={navbar}></HeaderSearch>
          <div className={styles["right-cart"]}>
            <Link href="/" className={styles.cart}>
              <span className={styles.count}>{count}</span>
            </Link>
          </div>
          <div className={styles["right-login"]}>登录</div>
        </div>
      </div>
    </div>
  );
});

export default NavBar;
NavBar.displayName = "NavBar";
