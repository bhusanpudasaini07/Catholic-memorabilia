import React from "react";
import { NextPageWithLayout } from "./_app";
import MainLayout from "@/shared/main-layout";


import Head from "next/head";
import { useCategoriesHooks } from "@/hooks/categories.hooks";
import { useProductsHooks } from "@/hooks/products.hooks";
import NewArrival from "@/features/Home/new-arrival";
import DeliverInfo from "@/features/Home/deliver-info";
import ProductsWithSwiper from "@/features/Home/products-Card";
import Banner from "@/shared/components/banner";
import BenefitsBar from "@/shared/components/benefits-bar";
import ShopByCollection from "@/features/Home/shop-by-collection";
import { useFavHooks } from "@/hooks/fav.hooks";
import Bundles from "@/features/Home/bundles";
import RecommendationsProducts from "@/features/Home/recommendations";
import { getCookie } from "cookies-next";

const Home: NextPageWithLayout = () => {
 const token = getCookie('isLoggedIn')

  const { categories, loading: loadingCategories } = useCategoriesHooks();
  const { products, productsLoading, newArrivalProducts, newArrivalProductsLoading, recommendations, recommendationsLoading } = useProductsHooks();
  const { favouriteList } = useFavHooks();

  const updatedProducts = products?.items?.map((item: any) => ({
    ...item,
    isFav: favouriteList?.some((favItem: any) => favItem?.id === item?.id)
  }));


  const updatedNewArrivalProducts = newArrivalProducts?.map((item: any) => ({
    ...item,
    isFav: favouriteList?.some((favItem: any) => favItem?.id === item?.id)
  }));

  console.log(recommendations);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      {/* /Banner  */}
      <section>
        <Banner />
      </section>

      {/* /Benefits Bar */}
      <BenefitsBar />
      <div className="container">
       {token && recommendations?.length > 0 && <RecommendationsProducts recommendations={recommendations} recommendationsLoading={recommendationsLoading} />}

        {/* Shop By Collection  */}
        <ShopByCollection
          products={categories?.items}
          loading={loadingCategories}
        />

        {/* New Arrival  */}
        <NewArrival
          loading={newArrivalProductsLoading}
          products={updatedNewArrivalProducts}
        />

        {/* Bundles  */}
        <Bundles />

        {/* Deliver Info  */}
        <section className="mb-10">
          <DeliverInfo />
        </section>

        {/* Products  */}
        <section>
          <ProductsWithSwiper
            title="All Products"
            subtitle="Browse our all products"
            products={[...(updatedProducts || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
            loading={productsLoading}
          />
        </section>
      </div>

    </>
  );
};
export default Home;
Home.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
