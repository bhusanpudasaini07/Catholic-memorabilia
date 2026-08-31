import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import MainLayout from "@/shared/main-layout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getPageData } from "@/services/page.service";
import Breadcrumb from "@/shared/components/breadcrumb";
import Loader from "@/components/Loading";
import Head from "next/head";
import SkeletonDynamicPage from "@/shared/components/skeleton/dynamic-page";

const PlantConsultation: NextPageWithLayout = () => {
  const router = useRouter();
  const { asPath } = router;
  const [descriptionContent, setDescriptionContent] = useState<string>("");
  const path = asPath.split("/");
  const slug = path[path.length - 1];
  const { data: plantConsultationData, isInitialLoading: fetchLoading } = useQuery({
    queryKey: ["getPageData", slug],
    queryFn: async () => {
      if (slug) {
        const response = await getPageData(slug);
        return response;
      }
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (plantConsultationData) {
      setDescriptionContent(plantConsultationData?.data?.content || "");
    }
  }, [plantConsultationData]);

  return (
    <>
      <Head>
        <title>{plantConsultationData?.data?.title || 'I am the Gardener'}</title>
      </Head>
      {
        fetchLoading ? (
          <SkeletonDynamicPage />

        ) : (
          <>
            <Breadcrumb title={plantConsultationData?.data?.title} />
            <div
              className="py-0 main-wrapper-block"
              dangerouslySetInnerHTML={{ __html: descriptionContent }}
            />
          </>
        )
      }

    </>
  );
};
export default PlantConsultation;
PlantConsultation.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
