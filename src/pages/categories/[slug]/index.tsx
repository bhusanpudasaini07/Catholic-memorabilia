import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import 'react-range-slider-input/dist/style.css';
import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/shared/main-layout';
import Card from '@/shared/components/card';
import Pagination from '@/shared/components/pagination';
import { useState } from 'react';
import { getProductByCategory } from '@/services/product.service';
import EmptyPage from '@/components/emptyPage';
import Slider from 'react-slider';
import { getConfig } from '@/services/home.service';
import { getTagList } from '@/services/tag.service';
import CategorySidebar from '@/shared/components/categorySidebar';
import TagSidebar from '@/shared/components/tagSidebar';
import Breadcrumb from '@/shared/components/breadcrumb';
import SortingDropdown from '@/shared/components/sorting-dropdown';
import SkeletonLoadingCard from '@/shared/components/skeleton/products';
import { ICartData, ICartItem } from '@/interface/cart.interface';
import Head from 'next/head';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import ProductDetailModal from '@/shared/components/product-detail-modal';


const CategoryDetail: NextPageWithLayout = () => {
    const router = useRouter()
    const { slug } = router.query
    const token = getToken()
    const [query, setQuery] = useState<string>('');
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [setFiltered, setSetFiltered] = useState(false);
    const [productData, setProductData] = useState(null);
    const [selectedValue, setSelectedValue] = useState<string>('')
    const [selectedPriceValue, setSelectedPriceValue] = useState<string>('')
    const [productModalId, setProductModalId] = useState<string>("")
    const [enableFilter, setEnableFilter] = useState<boolean>(false)
    // const { data: categories, isInitialLoading: loading }: any = useQuery({ queryKey: ['getCategoriesList'] });
    // const { data: cart } = useQuery<ICartData>(["getCartList"]);
    const { data: cart } = useQuery<ICartData>(["getCartList"]);
    const { data: tags } = useQuery({
        queryKey: ["getTagList"],
        queryFn: getTagList,
    });
    const { data: config } = useQuery({
        queryKey: ["getConfig"],
        queryFn: getConfig,
    });
    //For favourite map
    const { data: favList }: any = useQuery<any>(["wishlistProducts", token], { enabled: !!token });

    const minimumPrice = Number(config?.data?.minimumPrice);
    const maximumPrice = Number(config?.data?.pageData['max-price']);
    const isMinimumValid = !isNaN(minimumPrice) && isFinite(minimumPrice);
    const isMaximumValid = !isNaN(maximumPrice) && isFinite(maximumPrice);
    const initialValue = [
        isMinimumValid ? minimumPrice : 0,
        isMaximumValid ? maximumPrice : 3000
    ];
    const [value, setValue] = useState(initialValue);

    // Filter button clicked

    const handleFilterButtonClick = async () => {
        setSetFiltered(true); // Toggle the value of setFiltered
        setEnableFilter(!enableFilter)
    };

    // Handle categories link click
    // const handleCategoriesClick = () => {
    //     setValue(initialValue); // Reset value to initial values
    // };

    //Fetch Category Data
    // const handleSortingChange = (value: string) => {
    //     setSelectedValue(value)
    // }

    const handleSortingChange = (value: string) => {
        if (value === 'asc' || value === 'desc') {
            setSelectedValue(value);
            setSelectedPriceValue('');
        } else if (value === 'low' || value === 'high') {
            setSelectedPriceValue(value);
            setSelectedValue('');
        }
    };
    const { data: initialProductData, isLoading } = useQuery(
        ['getProductByCategoryId', slug, pageNumber, enableFilter, selectedValue, selectedPriceValue],
        async () => {
            const response = await getProductByCategory(query, pageNumber, slug, value[0], value[1], selectedValue, selectedPriceValue);
            return response;
        },
    );
    const updatedData = initialProductData?.data?.map((item: any) => ({
        ...item,
        // product: {
        //     ...item.product,
        // }
        isFav: favList && favList?.data?.length > 0 ? favList?.data?.some((favItem: any) => favItem?.product_id === item?.id) : false,
        favId: favList && favList?.data?.length > 0 ? favList?.data.find((favItem: any) => favItem.product_id === item?.id)?.id : 0
    }));

    const handlePageChange = (value: number) => {
        setPageNumber(value)
    }


    useEffect(() => {
        if (initialProductData) {
            setProductData(initialProductData);
        }
    }, [initialProductData]);

    // Reset productData when setFiltered changes
    useEffect(() => {
        if (!setFiltered) {
            setProductData(initialProductData);
        }
    }, [setFiltered, initialProductData]);

    useEffect(() => {
        handlePageChange(1)
    }, [slug])

    return (
        <>
            <Head>
                <title>{initialProductData?.data[0]?.categoryTitle || ''}</title>
            </Head>
            <Breadcrumb title={initialProductData?.data[0]?.categoryTitle} />
            <div className='container my-[60px]'>
                <div className="grid grid-cols-12 md:gap-[30px]">
                    <div className='order-last col-span-12 md:order-first md:col-span-3 right-sidebar'>
                        <div className='mb-[20px]'>
                            <h3 className='right-sidebar-head'>
                                Filter By
                            </h3>
                            <div>
                                <h4 className='text-slate-850 font-semibold font-base mb-3.5'>Categories</h4>
                                <CategorySidebar />
                                {/* <ul className='pl-4'>
                                    {
                                        categories?.data?.map((item: any, index: number) => (
                                            <li key={`categories-${index}`} className='pb-2'>
                                                <Link href={`/categories/${item?.slug}`}
                                                    className={`block text-gray-550 font-semibold text-[15px] leading-[22px] transition-all delay-100 duration-300 hover:text-primary pb-2 capitalize ${item?.slug == slug && 'text-primary'}`}
                                                    onClick={handleCategoriesClick}
                                                >
                                                    {item?.title}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul> */}
                            </div>
                            <div className='mt-3.5'>
                                <h4 className='mb-4 font-semibold text-slate-850 font-base'>Price</h4>
                                <p className='text-sm leading-6 text-slate-850  mb-[20px] pricevalue'>NPR {value[0]} - NPR {value[1]}</p>
                                <div>
                                    <div>
                                        <Slider
                                            className='slider'
                                            onChange={setValue}
                                            value={value}
                                            min={minimumPrice}
                                            max={maximumPrice}
                                        />
                                    </div>

                                    <button
                                        className='btn btn-primary w-full font-bold px-[22px] py-[13px] rounded-[50px] text-white text-lg uppercase tracking-[1px] leading-[1] mt-[30px]'
                                        onClick={handleFilterButtonClick}>Filter</button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className='right-sidebar-head'>
                                Tag
                            </h3>
                            <TagSidebar />
                        </div>
                    </div>
                    <div className='col-span-12 md:col-span-9'>
                        <div className='flex flex-col sm:flex-row px-[30px] py-[10px] mb-[30px] bg-slate-150'>
                            <div className='flex-1 flex items-center mb-4 sm:mb-0 gap-[15px]'>
                                <p className='text-gray-750 text-sm leading-[20px]'>There Are {initialProductData?.data?.length} Products.</p>
                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <p className='text-gray-750 text-sm leading-[20px] p-2'>Sort By:</p>
                                <SortingDropdown sortChange={handleSortingChange} />
                            </div>
                        </div>
                        <div>
                            {
                                isLoading ?
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                        {[1, 2, 3, 4].map((index) => (
                                            <SkeletonLoadingCard
                                                key={`app-skeleton-${index}`}
                                            />
                                        ))}
                                    </div> :
                                    initialProductData.data?.length === 0 ? (
                                        <EmptyPage />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xxs:grid-cols-2 lg:grid-cols-4">
                                                {updatedData?.map((product: any, index: any) => (
                                                    <Card
                                                        setProductModalId={setProductModalId}
                                                        product={product}
                                                        key={`app-cat-products-${index}`}
                                                        cartItem={cart?.cartProducts.find((item) => item?.product?.id === product?.id)}
                                                    />
                                                ))}
                                            </div>
                                            <Pagination
                                                totalPages={initialProductData?.meta?.pagination?.total_pages}
                                                currentPage={initialProductData?.meta?.pagination?.current_page}
                                                pageChange={handlePageChange}
                                            />
                                        </>
                                    )
                            }
                        </div>
                        {
                            productModalId !== '' &&
                            <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}



export default CategoryDetail

CategoryDetail.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};
