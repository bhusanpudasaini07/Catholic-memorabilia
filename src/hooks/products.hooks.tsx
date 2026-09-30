import { getCategoriesList } from "@/services/home.service";
import { getAllProducts, getFeaturedProducts, getNewArrivalProducts } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductsHooks = () => {

    const getProducts = useQuery({
        queryKey: ["getProducts"],
        queryFn: getAllProducts,
    });
    const getFeaturedProductsQuery = useQuery({
        queryKey: ["allfeaturedProducts"],
        queryFn: getFeaturedProducts,
    });

    const getNewArrivalProductsQuery = useQuery({
        queryKey: ["allnewArrivalProducts"],
        queryFn: getNewArrivalProducts,
    });


    return {
        products: getProducts.data,
        productsLoading: getProducts.isLoading,
        featuredProducts: getFeaturedProductsQuery.data,
        featuredProductsLoading: getFeaturedProductsQuery.isLoading,
        newArrivalProducts: getNewArrivalProductsQuery.data,
        newArrivalProductsLoading: getNewArrivalProductsQuery.isLoading,
    };
}
