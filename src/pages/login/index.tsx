import { NextPageWithLayout } from '@/pages/_app';
import AuthBody from '@/shared/components/auth-body';
import Breadcrumb from '@/shared/components/breadcrumb';
import MainLayout from '@/shared/main-layout';
import Head from 'next/head';
import React from 'react'

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Breadcrumb />
      <AuthBody />
    </>
  )
}

export default Login

Login.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
