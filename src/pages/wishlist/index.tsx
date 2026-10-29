import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";
import { useQuery } from "@tanstack/react-query";
import { getWishlists } from "@/services/wishlist.service";
import EmptyPage from "@/components/emptyPage";
import Card from "@/shared/components/card";
import { useState } from "react";
import Breadcrumb from "@/shared/components/breadcrumb";
import Head from "next/head";
import { ICartData } from "@/interface/cart.interface";
import Pagination from "@/shared/components/pagination";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";

const Wishlist: NextPageWithLayout = () => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [productModalId, setProductModalId] = useState<string>("")

    const perPage = 10;

    const { data: wishlist, isLoading } = useQuery(
        ['getWishlists', pageNumber, perPage], () =>
        getWishlists()
            .then((response) => {
                return response
            })
    )
    const { data: cart } = useQuery<ICartData>(["getCartList"]);


    const updatedData = wishlist?.map((item: any) => ({
        ...item,
    }));

    /**
     * For page num change
     */
    const handlePageChange = (value: number) => {
        setPageNumber(value)
    }

    return (
        <div>
            <Head>
                <title>Wishlist</title>
            </Head>
            <Breadcrumb title="Wishlist" />
            <div className="wishlist-page">
                <div className="container">
                    {isLoading ? (
                        <div className="grid my-[60px] grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <SkeletonLoadingCard
                                    key={`app-skeleton-${index}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <section className="my-[60px]">
                                <div>
                                    {wishlist?.data?.length === 0 ? (
                                        <EmptyPage />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                                {updatedData?.map((favProduct: any, index: any) =>
                                                    <Card
                                                        setProductModalId={setProductModalId}
                                                        product={favProduct}
                                                        key={`app-cat-products-${index}`}
                                                        cartItem={cart?.cartProducts?.find((item) => item?.product?.id === favProduct?.product?.id)}
                                                    />
                                                )}

                                            </div>
                                            <Pagination
                                                currentPage={wishlist?.meta?.pagination?.current_page}
                                                pageChange={handlePageChange}
                                                totalPages={wishlist?.meta?.pagination?.total_pages}
                                            />
                                        </>
                                    )}
                                </div>
                            </section>

                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Wishlist;
Wishlist.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}