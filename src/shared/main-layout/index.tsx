import React from "react";
import Header from "./header";
import Footer from "./footer";
import ScrollToTopButton from "./scroll-to-top";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { data: config }: any = useQuery(['getConfig']);
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      </Head>
      <>
        <Header />
        {children}
        <Footer />
        <ScrollToTopButton />
      </>
    </>
  );
};

export default MainLayout;
