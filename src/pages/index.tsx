import React from "react";
import { NextPageWithLayout } from "./_app";
import MainLayout from "@/shared/main-layout";


import Categories from "@/features/Home/categories";


import Head from "next/head";
import FeaturedProducts from "@/features/Home/featured-products";
import { useCategoriesHooks } from "@/hooks/categories.hooks";
import { useProductsHooks } from "@/hooks/products.hooks";
import NewArrival from "@/features/Home/new-arrival";
import DeliverInfo from "@/features/Home/deliver-info";
import Footer from "@/shared/main-layout/footer";
import ProductsWithSwiper from "@/features/Home/products-Card";

const Home: NextPageWithLayout = () => {

  const { categories, loading: loadingCategories } = useCategoriesHooks();
  const { products, productsLoading, featuredProducts, featuredProductsLoading, newArrivalProducts, newArrivalProductsLoading } = useProductsHooks();

  return (
    <>
      <Head>
      
        <title>Home</title>
      </Head>
      <div className="content">
        <div className="container">
          {/* Featured  */}
          <section className="mt-5">

            <FeaturedProducts
              loading={productsLoading}
              products={featuredProducts}
            />
          </section>
          {/* New Arrival  */}
          <section>
            <NewArrival
              loading={newArrivalProductsLoading}
              products={newArrivalProducts}
            />
          </section>
          {/* Deliver Info  */}
          <section >
            <DeliverInfo />
          </section>
          {/* Categories  */}
          <section>
            <Categories
              loading={loadingCategories}
              categories={categories?.items}
            />
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
          <section>
            <Footer />
          </section>
        </div>
      </div>

    </>
  );
};
export default Home;
Home.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
