import { ReactElement, memo } from "react";
import type { FC } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
interface IProps {
  children?: ReactElement;
}
const Layout: FC<IProps> = memo(function (props) {
  const { children } = props;
  return (
    <div className="layout">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
});

export default Layout;
Layout.displayName = "Layout";
