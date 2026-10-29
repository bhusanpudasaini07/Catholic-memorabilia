import React from "react";
import Header from "./header";
import Footer from "./footer";
import ScrollToTopButton from "./scroll-to-top";
import Head from "next/head";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      </Head>
      <div className="bg-body" >
        <Header />
        {children}
          <Footer />
          <ScrollToTopButton />
        </div>
    </>
  );
};

export default MainLayout;
