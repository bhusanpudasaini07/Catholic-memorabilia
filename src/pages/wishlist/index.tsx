import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";
import { useQuery } from "@tanstack/react-query";
import { getWishlists } from "@/services/wishlist.service";
import Loader from "@/components/Loading";
import EmptyPage from "@/components/emptyPage";
import Card from "@/shared/components/card";
import { useState } from "react";
import Breadcrumb from "@/shared/components/breadcrumb";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import Head from "next/head";
import { ICartData, ICartItem } from "@/interface/cart.interface";
import Pagination from "@/shared/components/pagination";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import ProductDetailModal from "@/shared/components/product-detail-modal";

const Wishlist: NextPageWithLayout = () => {
    const token = getToken()
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [productModalId, setProductModalId] = useState<string>("")

    const perPage = 10;

    const { data: wishlist, isLoading } = useQuery(
        ['getWishlists', pageNumber, perPage], () =>
        getWishlists(pageNumber, perPage)
            .then((response) => {
                return response
            })
    )
    const { data: cart } = useQuery<ICartData>(["getCartList"]);

    const { data: favList }: any = useQuery<any>(["wishlistProducts", token], { enabled: !!token });

    const updatedData = wishlist?.data?.map((item: any) => ({
        ...item,
        product: {
            ...item.product,
            isFav: favList && favList?.data?.length > 0 ? favList?.data?.some((favItem: any) => favItem?.product_id === item?.product?.id) : false,
            favId: favList && favList.data.length > 0 ? favList?.data.find((favItem: any) => favItem.product_id === item?.product?.id)?.id : 0
        },
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
                                                        product={favProduct?.product}
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
                {
                    productModalId !== '' &&
                    <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
                }
            </div>

        </div>
    )
}

export default Wishlist;
Wishlist.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}