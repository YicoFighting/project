import "normalize.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import wrapper from "@/store";
import { Provider } from "react-redux";

export default function App({ Component, ...rest }: AppProps) {
  // redux 的接入
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Layout>
        <Component {...props.pageProps} />
      </Layout>
    </Provider>
  );
}
