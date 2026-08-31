import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";


const CategorySidebar = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { data: categories }: any = useQuery(["getCategoriesList"])

    return (
        <ul className='pl-4'>
            {
                categories?.data?.map((item: any, index: number) => (
                    <li key={`categories-${index}`} className='pb-2'>
                        <Link href={`/categories/${item?.slug}`}
                            aria-label={`categories-${index}`}
                            className={`block text-gray-550 font-semibold text-[15px] leading-[22px] transition-all delay-100 duration-300 hover:text-primary pb-2 capitalize ${item?.slug == slug && 'text-primary'}`}
                        >
                            {item?.name}
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}

export default CategorySidebar