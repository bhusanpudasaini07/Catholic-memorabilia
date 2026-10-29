import { getCategoriesList } from "@/services/home.service";
import { getProfile } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const useProfileHooks = () => {
const isLoggedIn = getCookie('isLoggedIn')
    const { data: profile, initialLoading: profileLoading }: any = useQuery({
        queryFn: () => getProfile(),
        queryKey: ['profile'],
        enabled: !!isLoggedIn
    })

    return {
            profile,
            profileLoading,
    };
}
