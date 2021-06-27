import "../styles/global.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { Navigation } from "../components/Navigation";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Navigation />
      <Component {...pageProps} />
    </SWRConfig>
  );
}
export default MyApp;
