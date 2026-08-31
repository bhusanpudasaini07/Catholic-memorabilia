import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MainLayout from '@/shared/main-layout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductsFromSlug, getRelatedProductsFromId } from '@/services/product.service';
import Breadcrumb from '@/shared/components/breadcrumb';
import Link from 'next/link';
import { ICartData, ICartItem, ICreateCartItem, IUpdateCartItem } from '@/interface/cart.interface';
import { ICartProduct } from '@/interface/product.interface';
import ButtonLoader from '@/shared/components/btn-loading';
import Head from 'next/head';
import { addToCart, getCartData, getCartProduct } from '@/services/cart.service';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import SkeletonImage from '@/shared/components/skeleton/image';
import CardHeartIcon from '@/shared/icons/common/CardHeartIcon';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { useWishlists } from '@/hooks/wishlist.hooks';
import SkeletonDescription from '@/shared/components/skeleton/description';
import { ITag } from '@/interface/tag.interface';
import RelatedProducts from '@/features/Product/related-products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper';


const ProductSlug = () => {
  const router = useRouter()
  const { slug } = router.query;
  const token = getToken()
  const queryClient = useQueryClient();
  const [descriptionContent, setDescriptionContent] = useState<string>('');
  const [moreInfoContent, setMoreInfoContent] = useState<string>('');
  const [taxMessage, setTaxMessage] = useState<string>('');

  const [itemCartDetail, setItemCartDetail] = useState<ICartProduct>()
  const [value, setValue] = useState<number>(1);

  //for swiper carousel
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);


  const { data: cartData } = useQuery<ICartData>(['getCartList'], getCartProduct);

  const { data: productData, isLoading, error } = useQuery(
    ['getProductsFromSlug', slug],
    async () => {
      if (slug) {
        const response = await getProductsFromSlug(slug);
        const productId = response?.data?.id;
        return { response, productId };
      }
    }
  );

  //For SKU
  const [selectedSizeId, setSelectedSizeId] = useState<number>(0)
  const unitPriceArray = productData?.response?.data?.variants || [];
  const filteredUnitPrice = selectedSizeId
    ? unitPriceArray.filter((sizeObj: any) => sizeObj.size === selectedSizeId)
    : unitPriceArray;

  const { data: relatedProducts, isLoading: relatedProductsLoading } = useQuery(
    ['getRelatedProductsFromId', productData?.productId],
    async () => {
      if (productData?.productId) {
        const response = await getRelatedProductsFromId(productData?.productId);
        return response;
      }
    }
  );

  const handleCartAction = () => {
    const payload: ICreateCartItem = {
      note: '',
      variant_id: selectedPrice?.id,
      quantity: value,
    }
    mutation.mutate(payload)
  };

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      if (selectedCartItems && updateCart) {
        showToast(TOAST_TYPES.success, 'Product Updated Successfully');
      } else {
        showToast(TOAST_TYPES.success, 'Item Added To Cart Successfully');
      }
      queryClient.invalidateQueries(['getCartList'])
      queryClient.invalidateQueries(['getCart'])
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message)
    }
  })

  //updateCart function
  // const updateCartHandler = () => {
  //   if (value <= stock) {
  //     const payload: IUpdateCartItem = {
  //       note: '',
  //       quantity: value,
  //       product_number: selectedCartItems?.id || itemCartDetail?.id || productData?.productId
  //     }
  //     updateCartMutation.mutate(payload)
  //   }
  // }

  const { addFavMutation, removeFavMutation, addLoading, removeLoading } = useWishlists() //for adding products for wishlist ->hook
  //getFavlist items
  const { data: favList }: any = useQuery<any>(["wishlistProducts", token], { enabled: !!token });

  /*
   ** Add product in favourite list
  */
  const addToFav = (id: number) => {
    addFavMutation.mutate(id)
  }

  /*
 ** Remove product from favourite list
*/
  const removeFromFav = (id: number) => {
    removeFavMutation.mutate(id)
  }

  /**
   * to check if the product is in fav list or not
   */
  const isFavGen = () => {
    if (favList && favList?.data?.length > 0) {
      const isfavResult = favList?.data?.some((favItem: any) => (
        (favItem?.product_id === productData?.productId))
      );
      return isfavResult;
    }
  }

  /**
   * To generate the fav id in order to implement remove from fav
   */
  const genFavId = () => {
    if (favList && favList?.data?.length > 0) {
      const favId = favList?.data.find((favItem: any) => (
        favItem.product_id === productData?.productId));
      return favId?.id || 0;
    }

  }
  const favId = genFavId() //setting generated fav id.

  useEffect(() => {
    if (cartData) {
      cartData?.cartProducts?.map((item: any) => {
        if (slug === item?.product?.slug) {
          setItemCartDetail(item)
        }
      })
    }
  }, [slug, cartData])

  useEffect(() => {
    if (productData) {
      setMoreInfoContent(productData?.response?.data?.description || '');
      const message = productData?.response?.data?.taxable ? 'Including Tax' : 'Excluding Tax';
      setTaxMessage(message);
    }
  }, [productData]);

  useEffect(() => {
    if (productData) {
      setSelectedSizeId(productData?.response?.data?.variants[0]?.id)
    }
  }, [productData])



  //for SKU multiple
  //For checking if the selected size and the mapped pricec are equal to show the change in price
  const selectedPrice = productData?.response?.data?.variants?.find((price: any) => price?.id === selectedSizeId);

  //to display image according to the changed size.
  const selectedImg = productData?.response?.data?.webpImages ?
    productData?.response?.data?.webpImages?.find((img: any) => img?.unit_price_id === selectedSizeId)
    : productData?.response?.data?.images?.find((img: any) => img?.unit_price_id === selectedSizeId);
  const updateCart = cartData?.cartProducts?.find((cartItem: any) => JSON.parse(cartItem?.selectedUnit?.id) === selectedSizeId) ? true : false

  //checking stock for each product/sku element
  const stock: any = productData?.response?.data?.variants?.find((price: any) => price?.id === selectedSizeId)?.stock
  const selectedCartItems: ICartProduct | undefined = cartData?.cartProducts?.find((cart: any) => JSON.parse(cart?.selectedUnit?.id) === selectedSizeId);

  useEffect(() => {
    if (updateCart) {
      setValue(selectedCartItems?.quantity!)
    } else {
      setValue(1)
    }
  }, [selectedCartItems, selectedSizeId])

  return (
    <>
      <Head>
        <title>{productData?.response?.data?.name}</title>
      </Head>
      <Breadcrumb title={productData?.response?.data?.name} />
      <section className="my-[60px]">
        <div className="container">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-5">
              {
                isLoading ?
                  <SkeletonImage />
                  : (
                    productData?.response?.data?.variants.length > 1 && selectedImg ? (
                      <>
                        <div className='w-full'>
                          <Image
                            src={selectedImg?.imageName}
                            alt='Product Image'
                            width={330} height={330}
                          />
                        </div>
                        <div className="flex justify-start w-full gap-2 py-2">
                          <Image alt='Product image' className='border border-primary' src={selectedImg?.imageName} width={90} height={90} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Swiper
                          spaceBetween={10}
                          thumbs={thumbsSwiper ? { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null } : undefined}
                          modules={[Thumbs]}
                          className="mySwiper2"
                        >
                          {
                            productData?.response?.data?.images?.map((img: any, index: number) => (
                              <SwiperSlide key={index}>
                                <Image
                                  alt='Product Image'
                                  src={img?.imageName}
                                  width={330} height={330}
                                />
                              </SwiperSlide>
                            ))
                          }
                        </Swiper>
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          spaceBetween={10}
                          slidesPerView={4}
                          watchSlidesProgress={true}
                          modules={[Thumbs]}
                          className="mySwiper"
                        >
                          {
                            filteredUnitPrice?.length > 1 ? (
                              filteredUnitPrice.map((sizeObj: any, index: number) => (
                                <SwiperSlide key={index}>
                                  <Image className='cursor-pointer' alt='Product image' src={sizeObj?.image?.imageName} width={90} height={90} />
                                </SwiperSlide>
                              ))
                            ) : (
                              productData?.response?.data?.images?.map((img: any, index: number) => (
                                <SwiperSlide key={index}>
                                  <Image
                                    className='m-auto cursor-pointer'
                                    alt='Product Image'
                                    src={img?.imageName}
                                    width={90} height={90}
                                  />
                                </SwiperSlide>
                              ))
                            )
                          }

                        </Swiper>
                      </>
                    )
                  )
              }

            </div>
            <div className="col-span-12 md:col-span-7">
              {
                isLoading ? (
                  <SkeletonDescription />
                ) : (
                  <>
                    <h2 className="mb-6 text-2xl font-semibold text-slate-850">
                      {productData?.response?.data?.name}
                    </h2>
                    <p className='mb-2 text-sm font-bold text-sllate-850'>Availability: {' '}
                      {
                        selectedPrice?.stock === 0 ? (
                          <span className='font-semibold text-red-250'>Out Of Stock</span>
                        ) : (
                          <span className='font-semibold text-primary'>In Stock</span>
                        )
                      }
                    </p>

                    <p className="flex items-center gap-3 mb-2 text-sm font-bold text-slate-850">
                      Category:
                      <Link href={`/category/${productData?.response?.data?.categorySlug}`} aria-label="category-title" className="mb-0 text-primary hover:text-orange-450">
                        <span className="font-normal">{productData?.response?.data?.restaurantName}</span>
                      </Link>
                    </p>
                    <p className="flex items-center gap-3 mb-2 text-sm font-bold color-slate-850">
                      Tags:
                      {productData?.response?.data?.tags?.map((prev: ITag, index: number) => (
                        <Link href={`/tag?id=${prev?.slug}`} aria-label="tag-title" className="mb-0 capitalize transition-all text-primary hover:text-orange-450" key={`tag-${index}`}>
                          <span className="font-normal">{prev?.name}</span>
                        </Link>
                      ))}
                    </p>
                    <ul className="flex my-5">

                      {
                        selectedPrice && selectedPrice?.hasOffer ? (
                          <>
                            <li className="mr-1 text-base font-bold text-red-250">
                              NPR
                              <span>
                                {selectedPrice?.newPrice * value}
                              </span>
                            </li>

                            <li className="mr-1 text-base font-bold line-through text-primary">
                              NPR
                              <span>
                                {selectedPrice?.oldPrice}
                              </span>
                            </li>
                          </>
                        ) : (
                          < li className="mr-1 text-base font-bold text-primary" >
                            NPR
                            <span className='ml-1'>
                              {selectedPrice?.sellingPrice * value}
                            </span>
                          </li>
                        )
                      }
                      <li className="text-base font-bold text-primary ">
                        ( <span dangerouslySetInnerHTML={{ __html: taxMessage }} />)
                      </li>
                    </ul>

                    <p dangerouslySetInnerHTML={{ __html: selectedPrice?.description, }} />

                    {
                      unitPriceArray.length > 1 &&
                      <div className='mt-3'>
                        <p className='mb-3 text-lg font-bold text-slate-850'>Size</p>
                        <select name="" id=""
                          value={selectedSizeId}
                          onChange={(e) => setSelectedSizeId(JSON.parse(e.target.value))}
                          className='px-3 py-1 w-[175px] focus:outline-none text-lg border rounded-[4px] border-primary text-slate-850'>
                          {
                            unitPriceArray?.map((size: any) => (
                              <option key={size?.id} value={size?.id}><p>{size?.size}</p></option>
                            ))
                          }
                        </select>
                      </div>
                    }
                    <div className="w-100 flex my-[30px]">
                      <div className="h-[48px] flex items-center border border-solid border-gray-950 overflow-hidden relative text-gray-250">
                        <button
                          onClick={() => { setValue(value - 1) }}
                          disabled={value === 1 ? true : false}
                          className="w-6 h-12 text-sm font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
                          -
                        </button>
                        <input
                          type="text"
                          name="qtybutton"
                          className="flex-grow w-[30px] text-sm text-center h-[48px] focus-visible:border-none focus-visible:outline focus:outline-none"
                          readOnly
                          value={value}
                        />
                        <button
                          onClick={() => { setValue(value + 1) }}
                          disabled={value === stock ? true : false}
                          className="w-6 h-12 text-sm font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
                          +
                        </button>
                      </div>
                      <div>
                        {
                          selectedCartItems && updateCart ?
                            <button
                              type='button'
                              onClick={handleCartAction}
                              disabled={mutation.isLoading || selectedPrice?.stock === 0}
                              className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100 ml-2.5 h-[48px] text-normal hover:bg-orange-250 hover:text-base-100`}>

                              + Update To Cart
                              {
                                mutation.isLoading &&
                                <ButtonLoader />
                              }
                            </button>
                            :
                            <button
                              type='button'
                              onClick={handleCartAction}
                              disabled={mutation.isLoading || selectedPrice?.stock === 0}
                              className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100 ml-2.5 h-[48px] text-normal hover:bg-orange-250 hover:text-base-100`}>

                              + Add To Cart
                              {
                                mutation.isLoading &&
                                <ButtonLoader />
                              }
                            </button>
                        }
                      </div>
                    </div>
                    {
                      token && (
                        isFavGen() ?
                          <button onClick={() => removeFromFav(productData?.productId)} className='flex items-center gap-3 font-normal'>
                            {
                              removeLoading ? (
                                <ButtonLoader className='!border-primary' />
                              ) : (
                                <>
                                  <CardHeartIcon className="stroke-[#E5002B] fill-[#E5002B]" />
                                  Remove from wishlist
                                </>
                              )
                            }
                          </button> :
                          <button onClick={() => addToFav(productData?.productId)} className='flex items-center gap-3 font-normal'>
                            {
                              addLoading ? (
                                <ButtonLoader className='!border-primary' />
                              ) : (
                                <>
                                  <CardHeartIcon />
                                  Add to wishlist
                                </>
                              )
                            }
                          </button>
                      )
                    }
                  </>
                )
              }

            </div>
          </div>
        </div >
      </section >

      {
        moreInfoContent !== '' &&
        <div className="mb-[60px]">
          <div className="container">
            <a data-toggle="tab" className="active relative flex justify-center uppercase pb-3 text-lg font-bold text-center after:h-[2px] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:transition-all after:duration-300 after:ease-linear after:bg-primary text-slate-850 after:w-[250px] after:text-center after:m-auto">
              Product Description
            </a>
            <div className="px-8 py-10 overflow-hidden text-base leading-6 text-left bg-white border border-gray-200 tab-content">
              <div id="productDetail" className="tab-pane active">
                <div className="product-anotherinfo-wrapper">
                  <div className="text-justify description__text">
                    <p dangerouslySetInnerHTML={{ __html: moreInfoContent, }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Related Products */}
      {
        relatedProducts && relatedProducts?.data.length !== 0 &&
        <RelatedProducts relatedProductsLoading={relatedProductsLoading} relatedProducts={relatedProducts?.data} />
      }
    </>
  );
}

export default ProductSlug;
ProductSlug.getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};

