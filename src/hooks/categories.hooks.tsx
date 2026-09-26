import { getCategoriesList } from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

export const useCategoriesHooks = () => {

    const getCategories = useQuery({
        queryKey: ["getCategoriesList"],
        queryFn: getCategoriesList,
    });

    return {
        categories: getCategories.data,
        loading: getCategories.isLoading,
    };
}
