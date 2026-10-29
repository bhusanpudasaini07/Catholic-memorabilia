import MainLayout from "@/shared/main-layout";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getPageData } from "@/services/page.service";
import Loader from "@/components/Loading";
import Breadcrumb from "@/shared/components/breadcrumb";
import Head from "next/head";

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ContentPage: NextPageWithLayout = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const [descriptionContent, setDescriptionContent] = useState("");
  const { data: pageData, isInitialLoading: fetchLoading } = useQuery({
    queryKey: ["getPageData", slug],
    queryFn: async () => {
      if (slug) {
        const response = await getPageData(slug);
        return response;
      }
    },
    enabled: !!slug,
    retry: false,
  });

  useEffect(() => {
    if (pageData) {
      setDescriptionContent(pageData?.data?.content || "");
    }
  }, [pageData]);

  const pageTitle = pageData?.data?.title || (slug ? titleFromSlug(slug) : "");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {fetchLoading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb title={pageTitle} />
          <div
            className="main-wrapper-block"
            dangerouslySetInnerHTML={{ __html: descriptionContent }}
          />
        </>
      )}
    </>
  );
};

export default ContentPage;

ContentPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
