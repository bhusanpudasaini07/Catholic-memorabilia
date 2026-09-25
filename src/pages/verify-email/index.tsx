import React, { useCallback, useEffect } from "react";
import MainLayout from "@/shared/main-layout";
import Categories from "@/features/Home/categories";

import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPageWithLayout } from "../_app";
import { verifyEmail } from "../../services/auth.service";
import { useRouter } from "next/router";
import ScreenSplash from "../../shared/components/loader/spalsh-loader";

const VerifyEmailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query;

  const onSuccess = useCallback(
    (data: any) => {
      if (data.status === 201) {
        router.push("/login");
      }
    },
    [router],
  );
  const onError = useCallback(
    (data: any) => {
      if (data?.response?.status === 401) {
        router.push("/login");
      }
    },
    [router],
  );

  const mutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess,
    onError,
  });
  console.log(query);

  useEffect(() => {
    const token = query.token;
    console.log("here");
    if (typeof token === "string") mutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="text-lg font-bold ">
      <div className="container mt-6">
        <div>loading...</div>
        <ScreenSplash />
      </div>
    </div>
  );
};
export default VerifyEmailPage;
VerifyEmailPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
