import { ReactElement, memo } from "react";
import type { FC } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import wrapper from "@/store";
import { IDetailPageInfo, getDetailPageInfo } from "@/service/detail";
import Link from "next/link";
import Image from "next/image";
import GridView from "@/components/grid-view";
import { fetchSearchSuggest } from "@/store/module/home";

interface IProps {
  children?: ReactElement;
  detailPageInfo?: IDetailPageInfo;
}
const Detail: FC<IProps> = memo(function (props) {
  const { children, detailPageInfo } = props;

  return (
    <div className={styles.detail}>
      <div className={classNames("wrapper", styles.content)}>
        <div className={styles.banner}>
          <Link href={"/"}>
            {detailPageInfo?.webPic && (
              <Image
                className={styles.image}
                src={detailPageInfo?.webPic}
                alt="webPic"
                fill
                priority
              ></Image>
            )}
          </Link>
        </div>

        <GridView products={detailPageInfo?.products}></GridView>
      </div>
    </div>
  );
});

export default Detail;
Detail.displayName = "Detail";

// ssr
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => {
    return async (ctx) => {
      await store.dispatch(fetchSearchSuggest()); // 触发异步 actions

      // 拿到详情数据
      const { id } = ctx.query;
      const { data } = await getDetailPageInfo(id as string);

      return {
        props: {
          detailPageInfo: data,
        },
      };
    };
  });
