import React from "react";
import Header from "./header";
import Footer from "./footer";
import ScrollToTopButton from "./scroll-to-top";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: config }: any = useQuery(['getConfig']);
  return (
    <>
      <Head>
        <title></title>
        <meta name="description"
          content={config ? config?.meta?.socialTags.description : ''}
          key={config ? config?.meta?.socialTags.keywords : ''}
        />
        <meta property="og:title" content={config ? config?.meta?.socialTags['og:title'] : ''} />
        <meta
          property="og:description"
          content={config ? config?.meta?.socialTags['og:description'] : ''}
        />
        <meta
          property="og:image"
          content={config ? config?.meta?.socialTags['og:image'] : ''}
        />
        <meta property="twitter:title" content={config ? config?.meta?.socialTags['twitter:title'] : ''} />
        <meta
          property="twitter:description"
          content={config ? config?.meta?.socialTags['twitter:description'] : ''}
        />
        <meta
          property="twitter:image"
          content={config ? config?.meta?.socialTags['twitter:image'] : ''}
        />
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
