import "@/styles/globals.scss";
import 'swiper/css/grid';
import 'react-toastify/dist/ReactToastify.css';

import "@/styles/abstract/utils.scss";
import "@/styles/pages/innerpages.scss";
import "@/styles/pages/account.scss";
import "@/styles/components/card.scss";
import "@/styles/components/pageBanner.scss";
import "@/styles/components/pagination.scss";
import "@/styles/components/auth.scss";
import "@/styles/components/btn.scss";
import "@/styles/components/slider.scss";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import type { AppProps } from "next/app";

import { Open_Sans } from "next/font/google";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const openSans = Open_Sans({ subsets: ["latin"] });

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient()
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const getLayout = Component.getLayout ?? ((page) => page);
  if (!isClient) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <div className={openSans.className}>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </QueryClientProvider>
  );
}
