import { ReactElement, memo } from "react";
import type { FC } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { ICategory } from "@/service/home";
import { Col, Row } from "antd";
import Image from "next/image";

interface IProps {
  children?: ReactElement;
  categorys?: ICategory[];
}
const TabCategory: FC<IProps> = memo(function (props) {
  const { children, categorys = [] } = props;
  return (
    <div className={styles["tab-category"]}>
      <div className={classNames("wrapper", styles.content)}>
        <Row>
          {categorys.map((category) => {
            return (
              <Col span={6} key={category.cid}>
                <div key={category.cid} className={styles["category-item"]}>
                  <Image
                    className={styles.image}
                    src={category.picStr!}
                    alt="category"
                    width={48}
                    height={48}
                  ></Image>

                  <div className={styles.right}>
                    <div className={styles.title}> {category.title}</div>
                    {category.type === 1 && (
                      <div className={styles["sub-title"]}>
                        <span className={styles.count}>{category.count}</span>
                        <span className={styles.desc}>{category.desc}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
});

export default TabCategory;
TabCategory.displayName = "TabCategory";
