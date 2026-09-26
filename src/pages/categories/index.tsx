import React from "react";
import MainLayout from "@/shared/main-layout";
import Categories from "@/features/Home/categories";

import { NextPageWithLayout } from "../_app";
import { useCategoriesHooks } from "@/hooks/categories.hooks";

const CategoriesPage: NextPageWithLayout = () => {
  
  const { categories, loading } = useCategoriesHooks();
  return (
    <div className="text-lg font-bold ">
      <div className="container mt-6">
        <Categories loading={loading} categories={categories} />
      </div>
    </div>
  );
};
export default CategoriesPage;
CategoriesPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
