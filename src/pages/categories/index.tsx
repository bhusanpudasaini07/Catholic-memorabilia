import React from "react";
import MainLayout from "@/shared/main-layout";
import Categories from "@/features/Home/categories";

import { useQuery } from "@tanstack/react-query";
import { NextPageWithLayout } from "../_app";

const CategoriesPage: NextPageWithLayout = () => {

    const { data: categories, isInitialLoading }: any = useQuery({ queryKey: ['getCategoriesList'] });


    return (
        <div className="text-lg font-bold ">
            <div className="container mt-6">
                <Categories
                    loading={isInitialLoading}
                    categories={categories?.data}
                />
            </div>
        </div>
    );
};
export default CategoriesPage;
CategoriesPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};
