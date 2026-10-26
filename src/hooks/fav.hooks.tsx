import { getCategoriesList } from "@/services/home.service";
import { getAllProducts, getFeaturedProducts, getNewArrivalProducts } from "@/services/product.service";
import { getAllWishlistProducts } from "@/services/wishlist.service";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useFavHooks = () => {
    const loggedIn = getCookie('isLoggedIn');

    const {
        data: favListProducts,
        isLoading: favListProductsLoading,
    } = useQuery({
        queryKey: ["wishlistProducts", loggedIn],
        queryFn: getAllWishlistProducts,
        enabled: !!loggedIn,
    });

    return {
        favListProducts,
        favListProductsLoading,
    };
}
