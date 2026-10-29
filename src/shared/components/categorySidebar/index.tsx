import { useCategoriesHooks } from "@/hooks/categories.hooks";
import { getCategoriesList } from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";


const CategorySidebar = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { data: categories } = useQuery({
        queryKey: ["getCategoriesList"],
        queryFn: getCategoriesList,
    });
    return (
        <ul className='pl-2 max-h-[300px] overflow-y-auto'>
            {categories &&
                categories?.items?.length > 0 && categories?.items?.map((item: any, index: number) => (
                    <li key={`categories-${index}`} className='pb-2'>
                        <Link href={`/categories/${item?.id}`}
                            aria-label={`categories-${index}`}
                            className={`block text-gray-550 p-2 rounded-md font-semibold text-[15px] leading-[22px] transition-all delay-70 duration-300 hover:bg-primary hover:text-white pb-2 capitalize ${item?.id == slug && 'bg-primary text-white'}`}
                        >
                            {item?.categoryName}
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}

export default CategorySidebar