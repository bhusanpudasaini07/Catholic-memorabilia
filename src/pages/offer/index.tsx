import React, { ChangeEvent, useState } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/shared/main-layout";
import Card from "@/shared/components/card";
import { CardImg } from "@/shared/lib/image-config";
import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/services/offer.service";
import Link from "next/link";
import Loader from "@/components/Loading";
import EmptyPage from "@/components/emptyPage";
import Breadcrumb from "@/shared/components/breadcrumb";
import Head from "next/head";
import Pagination from "@/shared/components/pagination";
import SortingDropdown from "@/shared/components/sorting-dropdown";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import ProductDetailModal from "@/shared/components/product-detail-modal";

const Offer: NextPageWithLayout = () => {

  const [query, setQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [selectedPriceValue, setSelectedPriceValue] = useState<string>("")
  const [productModalId, setProductModalId] = useState<string>("")

  const offer = true

  const { data: offers, isLoading, error } = useQuery(
    ['getOffers', query, pageNumber, offer, selectedValue, selectedPriceValue], () =>
    getOffers(query, pageNumber, offer, selectedValue, selectedPriceValue)
  );

  const handlePageChange = (value: number) => {
    setPageNumber(value)
  }

  //Fetch Product Data
  const handleSortingChange = (value: string) => {
    if (value === 'asc' || value === 'desc') {
      setSelectedValue(value);
      setSelectedPriceValue('');
    } else if (value === 'low' || value === 'high') {
      setSelectedPriceValue(value);
      setSelectedValue('');
    }
  }
  return (
    <>
      <Head>
        <title>Offers</title>
      </Head>
      <Breadcrumb title="Offer" />

      <div className="offer-page">
        <div className="container">
          <section className="my-[60px]">
            <div>
              {offers?.length === 0 ? (
                <EmptyPage />
              ) : (
                <>

                  <div className="top-bar flex items-center justify-between bg-slate-150 mt-[60px] my-[20px] p-[10px]">
                    <div className="products-count">
                      <p className="text-sm font-normal text-gray-750">There are {offers?.data?.length} products</p>
                    </div>
                    <div className="flex items-center sorting">
                      <p className="pr-3 text-sm font-normal text-gray-750">Sort By:</p>
                      <SortingDropdown sortChange={handleSortingChange} />
                    </div>
                  </div>
                  {
                    isLoading ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((index) => (
                          <SkeletonLoadingCard
                            key={`app-skeleton-${index}`}
                          />
                        ))}
                      </div>
                    )
                      :
                      (
                        <>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {offers?.data?.map((product: any, index: any) => (
                              <Card
                                setProductModalId={setProductModalId}
                                product={product}
                                key={`app-cat-products-${index}`}
                              />
                            ))}
                          </div>
                          <Pagination
                            totalPages={offers?.meta?.pagination?.total_pages}
                            currentPage={offers?.meta?.pagination?.current_page}
                            pageChange={handlePageChange}
                          />
                        </>
                      )
                  }

                </>

              )}
            </div>
            {
              productModalId !== '' &&
              <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
            }
          </section>
        </div >
      </div >
    </>
  );
};

export default Offer;
Offer.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
