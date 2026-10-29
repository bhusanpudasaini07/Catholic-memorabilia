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

const Home: NextPageWithLayout = () => {

  const { categories, loading: loadingCategories } = useCategoriesHooks();
  const { products, productsLoading, newArrivalProducts, newArrivalProductsLoading } = useProductsHooks();
  const { favouriteList, loadingFavourite } = useFavHooks();
  console.log("favouriteList", favouriteList)

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

        {/* Shop By Collection  */}
        <ShopByCollection
          products={categories?.items}
          loading={loadingCategories}
        />

        {/* New Arrival  */}
        <NewArrival
          loading={newArrivalProductsLoading}
          products={newArrivalProducts}
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
            products={[...(products?.items || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
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
