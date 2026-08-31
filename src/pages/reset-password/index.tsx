import { NextPageWithLayout } from "@/pages/_app";
import AuthBody from "@/shared/components/auth-body";
import Breadcrumb from "@/shared/components/breadcrumb";
import MainLayout from "@/shared/main-layout";
import React from "react";

const ResetPassword: NextPageWithLayout = () => {
    return (
        <>
            <Breadcrumb />
            <AuthBody />
        </>
    )
}

export default ResetPassword;

ResetPassword.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}