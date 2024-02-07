import { ReactElement, memo } from "react";
import type { FC } from "react";
import styles from "./index.module.scss";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  children?: ReactElement;
  item?: any;
  showTip?: boolean;
}
const GridViewItem: FC<IProps> = memo(function (props) {
  const { children, item, showTip } = props;
  const newProduct = item?.products ? item.products : item;

  return (
    <div className={styles["grid-view-item"]}>
      <div className={styles["item-image"]}>
        {newProduct?.coverUrl && (
          <Image
            src={newProduct.coverUrl}
            alt="image"
            width={263}
            height={263}
            priority
          ></Image>
        )}
        {showTip && (
          <div className={styles.tip}>
            <div className={styles["min-price"]}>¥{newProduct?.minPrice}</div>
            <div className={styles["original-cost"]}>
              ¥{newProduct?.originalCost}
            </div>
          </div>
        )}
      </div>
      <div className={styles["item-info"]}>
        {newProduct?.couponLabelDesc && (
          <span className={styles.label}>{newProduct.couponLabelDesc}</span>
        )}
        <Link href="/" className={styles.name}>
          {newProduct?.name}
        </Link>
      </div>
      <div className={styles["item-price"]}>¥{newProduct?.minPrice}</div>
    </div>
  );
});

export default GridViewItem;
GridViewItem.displayName = "GridViewItem";
