import React, { ChangeEvent, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/shared/main-layout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getProductByTagId, getTagList } from "@/services/tag.service";
import Loader from "@/components/Loading";
import EmptyPage from "@/components/emptyPage";
import Card from "@/shared/components/card";
import Link from "next/link";
import { ITag } from "@/interface/tag.interface";
import TagSidebar from "@/shared/components/tagSidebar";
import Breadcrumb from "@/shared/components/breadcrumb";
import ProductDetailModal from "@/shared/components/product-detail-modal";
import SortingDropdown from "@/shared/components/sorting-dropdown";


const Tag: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query; // Access the value of the 'id' query parameter
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [productModalId, setProductModalId] = useState<string>("")
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [selectedPriceValue, setSelectedPriceValue] = useState<string>("")

  const offer = 1
  const maxPrice = null
  const minPrice = null
  const { data: tags } = useQuery({
    queryKey: ["getTagList"],
    queryFn: getTagList,
  });

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (tags && typeof id === 'string') {
      const tag = tags?.data?.find((tag: ITag) => tag.slug === id);
      if (tag) {
        setTitle(tag.title);
      }
    }
  }, [tags, id]);



  const { data: tagData, isLoading } = useQuery(
    ['getProductByTagId', query, pageNumber, id, maxPrice, minPrice, selectedValue, selectedPriceValue], () =>
    getProductByTagId(query, pageNumber, id, maxPrice, minPrice, selectedValue, selectedPriceValue)
  );

  if (isLoading) {
    // Show loader while data is being fetched
    return <Loader />;
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
    <div>
      <Breadcrumb title={title} />
      <div className='container my-[60px]'>
        <div className="grid grid-cols-12 md:gap-[30px]">
          <div className='order-last col-span-12 md:order-first md:col-span-3 right-sidebar'>
            <div className='mb-[20px]'>
              <h3 className='right-sidebar-head'>
                Tag
              </h3>
              <div>
                <TagSidebar />
                {/* <div className='flex flex-wrap'>
                  {
                    tags?.data?.map((item: any, index: number) => (
                        <div key={`categories-${index}`} className='mb-[20px]'>
                            <Link href={{ pathname: '/tag',query: { id: item?.slug }}}
                                className={`border border-gray-350 px-[25px] py-[10px] rounded-[30px] bg-white capitalize m-1 text-gray-550 text-sm leading-[20px] transition-all delay-100 duration-300 hover:bg-primary hover:text-white hover:border-primary ${item?.slug == id && 'text-white bg-orange-450'}`}
                            >
                                {item?.title}
                            </Link>
                        </div>
                    ))
                  }    
                </div> */}
              </div>
            </div>
          </div>
          <div className='col-span-12 md:col-span-9'>
            <div className="top-bar flex items-center justify-between bg-slate-150 mt-[60px] my-[20px] p-[10px]">
              <div className="products-count">
                <p className="text-sm font-normal text-gray-750">There are {tagData?.data?.length} products</p>
              </div>
              <div className="flex items-center sorting">
                <p className="pr-3 text-sm font-normal text-gray-750">Sort By:</p>
                <SortingDropdown sortChange={handleSortingChange} />
              </div>
            </div>
            <section className="my-[60px]">
              <div>
                {tagData?.data?.length === 0 ? (
                  <EmptyPage />
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {tagData?.data.map((product: any, index: any) => (
                      <Card
                        setProductModalId={setProductModalId}
                        product={product}
                        key={`app-cat-products-${index}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
            {
              productModalId !== '' &&
              <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
            }
          </div>
        </div>
      </div>
    </div>
  );

}
export default Tag;
Tag.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
