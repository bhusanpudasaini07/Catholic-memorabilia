import { useProductsHooks } from '@/hooks/products.hooks';
import MainLayout from '@/shared/main-layout';
import Head from 'next/head';
import React from 'react'
import NewInPage from '../page/new-in';
import { useFavHooks } from '@/hooks/fav.hooks';

const NewIn = () => {
  const { newArrivalProducts, newArrivalProductsLoading } = useProductsHooks();
  const { favouriteList } = useFavHooks();
  const updatedNewArrivalProducts = newArrivalProducts?.map((item: any) => ({
    ...item,
    isFav: favouriteList?.some((favItem: any) => favItem?.id === item?.id)
  }));
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
              products={updatedNewArrivalProducts}
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
