import { useProductsHooks } from '@/hooks/products.hooks';
import MainLayout from '@/shared/main-layout';
import Head from 'next/head';
import React from 'react'
import NewInPage from '../page/new-in';

const NewIn = () => {
    const { newArrivalProducts, newArrivalProductsLoading } = useProductsHooks();

  return (
    <>
    <Head>
      <title>New In</title>
    </Head>
    <div className="content">
        <div className="container">
    <section className="mt-5">
            <NewInPage
              loading={newArrivalProductsLoading}
              products={newArrivalProducts}
            />
        </section>
        </div>
    </div>
    </>
  )
}

export default NewIn


NewIn.getLayout = (page: React.ReactNode) => {
    return <MainLayout>{page}</MainLayout>
}
