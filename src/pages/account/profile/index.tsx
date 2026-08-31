import ProfileForm from "@/features/My-Account/profile-form";
import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React from "react";

const Profile = () => {
  return (
    <>
      <Head>
        <title> | Profile</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-solid border-gray-350">
        My Account Information
      </h5>
      <ProfileForm />
    </>
  );
};

export default Profile;

Profile.getLayout = (page: any) => {
  return <MainLayout>
    <AccountSidebarLayout>{page}</AccountSidebarLayout>
  </MainLayout>;
};
