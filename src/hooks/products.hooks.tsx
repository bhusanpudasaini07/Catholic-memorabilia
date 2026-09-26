import { getAllProducts } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductsHooks = () => {

    const getProducts = useQuery({
        queryKey: ["getProducts"],
        queryFn: getAllProducts,
    });

    return {
        products: getProducts.data,
        productsLoading: getProducts.isLoading,
    };
}
