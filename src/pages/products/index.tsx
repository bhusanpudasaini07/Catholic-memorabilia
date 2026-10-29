import MainLayout from '@/shared/main-layout'
import React, { useEffect, useState } from 'react'
import { NextPageWithLayout } from '../_app'
import Breadcrumb from '@/components/Breadcrumb'
import Card from '@/shared/components/card'
import axiosInstance from '@/axios/axiosInstance'
import { useQuery } from '@tanstack/react-query'
import { useFavHooks } from '@/hooks/fav.hooks'

const PAGE_SIZE = 10;

const Products: NextPageWithLayout = () => {
    const [searchInput, setSearchInput] = useState(''); 
    const [filters, setFilters] = useState({ search: '', page: 1 });
    const { favouriteList } = useFavHooks();
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters(current => current.search === searchInput.trim()
                ? current
                : { search: searchInput.trim(), page: 1 });
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data: products, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ['productsPage', filters.page, PAGE_SIZE, filters.search],
        queryFn: async ({ signal }) => {
            const response = await axiosInstance.get('/products', {
                params: { page: filters.page, limit: PAGE_SIZE, search: filters.search },
                signal,
            });
            return response.data;
        },
    });

    const updatedProducts = products?.items?.map((item: any) => ({
        ...item,
        isFav: favouriteList?.some((favItem: any) => favItem?.id === item?.id)
    }));
    // Support pagination metadata when supplied; otherwise use Previous/Next.
   
    const totalValue =  products?.totalItems ?? products?.total;
    const pagesValue = products?.totalPages ?? products?.totalPages;
    const totalPages = pagesValue != null && Number.isFinite(Number(pagesValue))
        ? Math.max(1, Number(pagesValue))
        : totalValue != null && Number.isFinite(Number(totalValue))
            ? Math.max(1, Math.ceil(Number(totalValue) / PAGE_SIZE))
            : null;
    const hasNextPage = totalPages !== null
        ? filters.page < totalPages
        : products?.hasNextPage ?? products?.items?.length === PAGE_SIZE;
    const searchPending = searchInput.trim() !== filters.search;

    return (
        <section>
            <Breadcrumb title="All Products" />
            <div className="container">
                <div className="py-10">
                    <div className="mb-6 items-end gap-3">
                        <div className="w-full">
                            <input
                                id="product-search"
                                type="search"
                                value={searchInput}
                                onChange={event => setSearchInput(event.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded border border-gray-300 px-4 py-3 focus:border-[#682C3E] focus:outline-none focus:ring-1 focus:ring-[#682C3E] placeholder:text-gray-500"
                            />
                        </div>

                    </div>
                    <div aria-live="polite" aria-busy={isFetching}>
                        {isLoading ? (
                            <p className="py-10 text-center" role="status">Loading products...</p>
                        ) : isError ? (
                            <div className="py-10 text-center" role="alert">
                                <p>Unable to load products. Please try again.</p>
                                <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 mt-3" onClick={() => refetch()}>Retry</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-12 gap-6">
                                {updatedProducts?.length > 0 ? updatedProducts?.map((item: any) => (
                                    <div className="col-span-6 md:col-span-3" key={item.id}>
                                        <Card setProductModalId={() => 'hi'} product={item} />
                                    </div>
                                )) : (
                                    <div className="col-span-12 py-10 text-center">
                                        <h1 className="text-2xl font-bold">No products found</h1>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <nav aria-label="Products pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40" disabled={filters.page === 1 || isFetching || searchPending || isError}
                            onClick={() => setFilters(current => ({ ...current, page: Math.max(1, current.page - 1) }))}>
                            Previous
                        </button>
                        <span className="text-sm" aria-live="polite">
                            Page {filters.page}{totalPages !== null ? ` of ${totalPages}` : ''}
                        </span>
                        <button type="button" className="rounded border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 bg-primary text-white" disabled={isFetching || searchPending || isError || !hasNextPage}
                            onClick={() => setFilters(current => ({ ...current, page: current.page + 1 }))}>
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </section>
    )
}

export default Products

Products.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}
