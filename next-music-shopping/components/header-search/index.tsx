import { ReactElement, memo, useState } from "react";
import type { FC, KeyboardEventHandler } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { ISearchSuggest } from "@/service/home";
import { useRouter } from "next/router";

interface IProps {
  children?: ReactElement;
  data?: ISearchSuggest;
}
const HeaderSearch: FC<IProps> = memo(function (props) {
  const { children, data } = props;
  const [inputFocus, setInputFocus] = useState(false);
  const router = useRouter();

  const handleInputFocus = (isFocus: boolean) => {
    setInputFocus(isFocus);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      setInputFocus(false);
      const target = event.target as HTMLInputElement;
      const defaultValue = data?.defaultKey ? data?.defaultKey : "蓝牙耳机";
      goToSearchPage(target.value ? target.value : defaultValue);
    }
  };

  const goToSearchPage = (name: string) => {
    router.push({
      pathname: "/search",
      query: {
        q: name,
      },
    });
  };
  const handleMouseDown = (name: string) => {
    goToSearchPage(name);
  };
  return (
    <div className={styles.search}>
      <div className={styles["search-bg"]}>
        <input
          className={styles.input}
          type="text"
          placeholder="蓝牙耳机"
          onFocus={() => handleInputFocus(true)}
          onBlur={() => handleInputFocus(false)}
          onKeyDown={($event) => handleKeyDown($event)}
        />
      </div>

      {/* 下拉的面板 */}
      <div
        className={classNames(
          styles["search-panel"],
          inputFocus ? styles.show : styles.hide
        )}
      >
        <div className={styles.shadow}></div>
        <h2>热门搜索</h2>
        <ul>
          {data?.configKey &&
            data.configKey.map((item, index) => {
              return (
                <li
                  key={index}
                  onMouseDown={() => handleMouseDown(item[index + 1])}
                >
                  {item[index + 1]}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
});

export default HeaderSearch;
HeaderSearch.displayName = "HeaderSearch";
