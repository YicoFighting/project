import { ReactElement, memo } from "react";
import type { FC } from "react";
import styles from "./index.module.scss";
import { IHotProduct, IProduct } from "@/service/home";
import { Col, Row } from "antd";
import GridViewItem from "../grid-view-item";

interface IProps {
  children?: ReactElement;
  products?: IHotProduct[] | IProduct[];
}

const GridView: FC<IProps> = memo(function (props) {
  const { children, products = [] } = props;
  return (
    <div className="grid-view">
      <Row>
        {products.map((product, index) => {
          return (
            <Col key={product.id} span={6}>
              <div className={styles["view-item"]}>
                <GridViewItem
                  item={product}
                  showTip={index === 0}
                ></GridViewItem>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
});

export default GridView;
GridView.displayName = "GridView";
