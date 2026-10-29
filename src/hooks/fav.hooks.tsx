import { getAllBundles } from "@/services/home.service";
import { getWishlists } from "@/services/wishlist.service";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useFavHooks = () => {
    const loggedIn = getCookie('isLoggedIn');

    const { data: favouriteList, isInitialLoading: loadingFavourite } = useQuery(
        ['wishlistProducts'],
        () => getWishlists(),
        {
          enabled: !!loggedIn, // Only enabled when login is true
        }
      );
      const { data: bundlesList, isInitialLoading: loadingBundles } = useQuery(
        ['bundlesList'],
        () => getAllBundles(),
      );

    return {
        favouriteList,
        loadingFavourite,
        bundlesList,
        loadingBundles,
    };
}
