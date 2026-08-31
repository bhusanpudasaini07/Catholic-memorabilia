import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../_app";
import Input from "postcss/lib/input";
import Image from 'next/image';
import { getSearchResults } from "@/services/search.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Card from "@/shared/components/card";
import EmptyPage from "@/components/emptyPage";
import { ChangeEvent, useState } from "react";
import Loader from "@/components/Loading";
import CategoryCard from "@/shared/components/category-card";
import Breadcrumb from "@/shared/components/breadcrumb";
import Head from "next/head";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import SortingDropdown from "@/shared/components/sorting-dropdown";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import Pagination from "@/shared/components/pagination";
import ProductDetailModal from "@/shared/components/product-detail-modal";

const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();
  const token = getToken()
  const { type, keyword } = router.query;
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [selectedPriceValue, setSelectedPriceValue] = useState<string>("")
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [productModalId, setProductModalId] = useState<string>("")

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };


  const { data: searchData, isLoading, error } = useQuery(['searchResults', type?.toString() || '', keyword?.toString() || '', selectedValue, pageNumber, selectedPriceValue], () =>
    getSearchResults(type?.toString() || '', keyword?.toString() || '', pageNumber, selectedValue, selectedPriceValue)
  );

  const { data: favList }: any = useQuery<any>(["wishlistProducts", token], { enabled: !!token });

  /**
   * Updates the search data and shows all items as well as fav products as well
   */
  const updatedData = searchData?.data?.map((item: any) => ({
    ...item,
    isFav: favList && favList?.data?.length > 0 ? favList?.data?.some((favItem: any) => favItem?.product_id === item?.id) : false,
    favId: favList && favList.data.length > 0 ? favList?.data.find((favItem: any) => favItem.product_id === item.id)?.id : 0
  }));

  const handleSortingChange = (value: string) => {
    if (value === 'asc' || value === 'desc') {
      setSelectedValue(value);
      setSelectedPriceValue('');
    } else if (value === 'low' || value === 'high') {
      setSelectedPriceValue(value);
      setSelectedValue('');
    }
  }

  /**
     * For page num change
     */
  const handlePageChange = (value: number) => {
    setPageNumber(value)
  }

  return (
    <div>
      <Head>
        <title>Search | {keyword}</title>
      </Head>
      {
        searchData?.data.length === 0 ? (
          <div className="my-[60px]">
            <EmptyPage type={type} />
          </div>
        ) : (
          <>
            <Breadcrumb title='Search' />
            <div className="offer-page">
              <div className="container">
                {/* Show the product data */}
                {type === 'product' && (
                  <div>
                    <div className="top-bar flex items-center justify-between bg-slate-150 mt-[60px] my-[20px] p-[10px]">
                      <div className="products-count">
                        <p className="text-sm font-normal text-gray-750">There are {searchData?.data?.length} products</p>
                      </div>
                      <div className="flex items-center sorting">
                        <p className="pr-3 text-sm font-normal text-gray-750">Sort By:</p>
                        <SortingDropdown sortChange={handleSortingChange} />
                        {/* <select defaultValue={selectedOption} onChange={handleSelectChange}>
                              <option value="">Please Select</option>
                              <option value="ascending">A to Z</option>
                              <option value="descending">Z to A</option>
                              <option value="low">Price(Low &gt; High)</option>
                              <option value="high">Price(High &lt; Low)</option>
                            </select> */}
                      </div>
                    </div>
                    <section className="my-[60px]">
                      {
                        isLoading ? (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((index) => (
                              <SkeletonLoadingCard
                                key={`app-skeleton-${index}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {updatedData.map((product: any, index: any) => (
                              <Card
                                setProductModalId={setProductModalId}
                                product={product}
                                key={`app-cat-products-${index}`}

                              />
                            ))}
                          </div>
                        )
                      }
                    </section>
                    {
                      productModalId !== '' &&
                      <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
                    }
                  </div>
                )}
                {/* Show the category data */}
                {type === 'category' && (
                  <section className="my-[60px]">
                    {
                      isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                          {[1, 2, 3, 4].map((index) => (
                            <SkeletonLoadingCard
                              key={`app-skeleton-${index}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                          {updatedData.map((item: any, index: number) => (
                            <CategoryCard
                              key={`categories-${index}`}
                              title={item?.name}
                              totalProducts={item?.productCount}
                              shopLink={`/categories/${item?.slug}`}
                              image={item?.webpBackgroundImage ? item?.webpBackgroundImage : item?.backgroundImage}
                            />
                          ))}
                        </div>
                      )
                    }
                  </section>
                )}

              </div>
              <Pagination
                currentPage={searchData?.meta?.pagination?.current_page}
                totalPages={searchData?.meta?.pagination?.total_pages}
                pageChange={handlePageChange}
              />
            </div >

          </>
        )
      }

    </div >
  );
};

export default SearchPage;
SearchPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
