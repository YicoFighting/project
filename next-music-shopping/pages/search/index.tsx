import GridView from "@/components/grid-view";
import { IProduct } from "@/service/home";
import { getProductSearchData } from "@/service/search";
import wrapper from "@/store";
import { fetchSearchSuggest } from "@/store/module/home";
import { GetServerSideProps } from "next";
import { ReactElement, memo } from "react";
import type { FC } from "react";
interface IProps {
  children?: ReactElement;
  products?: IProduct[];
}
const Search: FC<IProps> = memo(function (props) {
  const { children, products = [] } = props;
  return (
    <div className="search">
      <div className="wrapper">
        <GridView products={products}></GridView>
      </div>
    </div>
  );
});

export default Search;
Search.displayName = "Search";

// ssr
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => {
    return async (ctx) => {
      await store.dispatch(fetchSearchSuggest()); // 触发异步 actions

      const { q } = ctx.query;
      const { products } = await getProductSearchData({
        limit: 60,
        offset: 0,
        key: q as string,
      });

      return {
        props: {
          products: products,
        },
      };
    };
  });
