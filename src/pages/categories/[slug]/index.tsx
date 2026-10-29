import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react'
import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/shared/main-layout';
import Card from '@/shared/components/card';
import Pagination from '@/shared/components/pagination';
import { useState } from 'react';
import { getRelatedProductsFromId } from '@/services/product.service';
import EmptyPage from '@/components/emptyPage';
import Slider from 'react-slider';
import CategorySidebar from '@/shared/components/categorySidebar';
import Breadcrumb from '@/shared/components/breadcrumb';
import SortingDropdown from '@/shared/components/sorting-dropdown';
import SkeletonLoadingCard from '@/shared/components/skeleton/products';
import Head from 'next/head';


const CategoryDetail: NextPageWithLayout = () => {
    const router = useRouter()
    const { slug } = router.query
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [setFiltered, setSetFiltered] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('asc')
    const [selectedPriceValue, setSelectedPriceValue] = useState<string>('alphabet')
    const [productModalId, setProductModalId] = useState<string>("")
    const [priceCeiling, setPriceCeiling] = useState<number>(3000);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
    const [appliedPrice, setAppliedPrice] = useState<[number, number] | null>(null);
    const [categoryTitle, setCategoryTitle] = useState<string>('');
    const boundsSlug = useRef<string | null>(null);
    // const { data: categories, isInitialLoading: loading }: any = useQuery({ queryKey: ['getCategoriesList'] });


    // Filter button clicked

    const handleFilterButtonClick = () => {
        setSetFiltered(true);
        setPageNumber(1);
        setAppliedPrice(priceRange);
    };

    // Handle categories link click
    // const handleCategoriesClick = () => {
    //     setValue(initialValue); // Reset value to initial values
    // };

    //Fetch Category Data
    // const handleSortingChange = (value: string) => {
    //     setSelectedValue(value)
    // }

  


    const { data: initialProductData, isLoading } = useQuery(
        ['productByCategoryId', slug, appliedPrice?.[0] ?? null, appliedPrice?.[1] ?? null, selectedValue, selectedPriceValue],
        {
            enabled: !!slug,
            queryFn: async () => {
                const response = await getRelatedProductsFromId(slug,  selectedValue, selectedPriceValue, appliedPrice?.[0] ?? undefined, appliedPrice?.[1] ?? undefined);
                return response;
            },
        }
    );

    const handlePageChange = (value: number) => {
        setPageNumber(value)
    }

    const handleSortingChange = (sortBy: string, sortOrder: string) => {
        setSelectedValue(sortBy);
        setSelectedPriceValue(sortOrder);
    };

    useEffect(() => {
        handlePageChange(1)
        setAppliedPrice(null)
        setPriceCeiling(3000)
        setPriceRange([0, 3000])
        boundsSlug.current = null
        setCategoryTitle('')
    }, [slug])

    useEffect(() => {
        const name = initialProductData?.items?.[0]?.category?.categoryName
        if (name) setCategoryTitle(name)
    }, [initialProductData])

    useEffect(() => {
        if (appliedPrice || !slug || !initialProductData?.items?.length) return
        if (boundsSlug.current === String(slug)) return

        const prices = initialProductData.items
            .map((item: { productPrice?: string | number }) => Number(item.productPrice))
            .filter((price: number) => Number.isFinite(price))
        if (!prices.length) return

        const nextCeiling = Math.max(1, Math.ceil(Math.max(...prices)))
        boundsSlug.current = String(slug)
        setPriceCeiling(nextCeiling)
        setPriceRange([0, nextCeiling])
    }, [appliedPrice, initialProductData, slug])


    return (
        <>
            <Head>
                <title>{categoryTitle}</title>
            </Head>
            <Breadcrumb title={categoryTitle} />
            <div className='container my-[40px]'>
                <div className="grid grid-cols-12 md:gap-[30px]">
                    <div className='order-last col-span-12 md:order-first md:col-span-3 right-sidebar'>
                        <div className='mb-[20px]'>
                            <h3 className='right-sidebar-head'>
                                Filter By
                            </h3>
                            <div>
                                <h4 className='text-slate-850 font-semibold font-base mb-3.5'>Categories</h4>
                                <CategorySidebar />
                            </div>
                            <div className='mt-3.5'>
                                <h4 className='mb-4 font-semibold text-slate-850 font-base'>Price</h4>
                                <p className='text-sm leading-6 text-slate-850  mb-[20px] pricevalue'>AUD {priceRange[0]} - AUD {priceRange[1]}</p>
                                <div>
                                    <div>
                                        <Slider
                                            className='slider'
                                            value={priceRange}
                                            min={0}
                                            max={priceCeiling}
                                            step={1}
                                            minDistance={0}
                                            pearling
                                            ariaLabel={['Minimum price', 'Maximum price']}
                                            onChange={(value) => {
                                                if (Array.isArray(value)) {
                                                    setPriceRange([value[0], value[1]])
                                                }
                                            }}
                                        />
                                    </div>

                                    <button
                                        className='btn btn-primary w-full font-bold px-[22px] py-[13px] rounded-[50px] text-white text-lg uppercase tracking-[1px] leading-[1] mt-[30px]'
                                        onClick={handleFilterButtonClick}>Filter</button>
                                </div>
                            </div>
                        </div>
                        {/* <div>
                            <h3 className='right-sidebar-head'>
                                Tag
                            </h3>
                            <TagSidebar />
                        </div> */}
                    </div>
                    <div className='col-span-12 md:col-span-9'>
                        <div className='flex flex-col sm:flex-row px-[30px] py-[10px] mb-[30px] bg-slate-150'>
                            <div className='flex-1 flex items-center mb-4 sm:mb-0 gap-[15px]'>
                                <p className='text-gray-750 text-sm leading-[20px]'>There Are {initialProductData?.total ?? initialProductData?.items?.length ?? 0} Products.</p>
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
                                    initialProductData?.items?.length === 0 ? (
                                        <EmptyPage />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xxs:grid-cols-2 lg:grid-cols-3">
                                                {initialProductData?.items?.map((product: any, index: any) => (
                                                    <Card
                                                        setProductModalId={setProductModalId}
                                                        product={product}
                                                        key={`app-cat-products-${index}`}
                                                    />
                                                ))}
                                            </div>
                                            <Pagination
                                                totalPages={initialProductData?.total_pages}
                                                currentPage={initialProductData?.page}
                                                pageChange={handlePageChange}
                                            />
                                        </>
                                    )
                            }
                        </div>
                        
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
