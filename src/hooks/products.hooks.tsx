import { getAllProducts, getAllRecommendations, getFeaturedProducts, getNewArrivalProducts } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductsHooks = () => {

    const getProducts = useQuery({
        queryKey: ["getProducts"],
        queryFn: getAllProducts,
    });
    const getRecommendations = useQuery({
        queryKey: ["recommendations"],
        queryFn: getAllRecommendations,
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
        recommendations: getRecommendations.data,
        recommendationsLoading: getRecommendations.isLoading,
        products: getProducts.data,
        productsLoading: getProducts.isLoading,
        featuredProducts: getFeaturedProductsQuery.data,
        featuredProductsLoading: getFeaturedProductsQuery.isLoading,
        newArrivalProducts: getNewArrivalProductsQuery.data,
        newArrivalProductsLoading: getNewArrivalProductsQuery.isLoading,
    };
}
