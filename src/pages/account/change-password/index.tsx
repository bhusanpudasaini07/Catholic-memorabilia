import ChangePasswordForm from "@/features/My-Account/change-password-form";
import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React from "react";

const ChangePassword = () => {

  return (
    <>
      <Head>
        <title> | Change Password</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-solid border-gray-350">
        Change Password
      </h5>
      <ChangePasswordForm />
    </>
  );
};

export default ChangePassword;

ChangePassword.getLayout = (page: any) => {
  return <MainLayout>
    <AccountSidebarLayout>{page}</AccountSidebarLayout>
  </MainLayout>;
};
