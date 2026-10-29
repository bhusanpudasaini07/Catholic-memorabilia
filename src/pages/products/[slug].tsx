import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import MainLayout from '@/shared/main-layout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductsFromSlug, getRelatedProductsFromId } from '@/services/product.service';
import Breadcrumb from '@/shared/components/breadcrumb';
import Link from 'next/link';
import { ICartData } from '@/interface/cart.interface';
import { ICartProduct } from '@/interface/product.interface';
import ButtonLoader from '@/shared/components/btn-loading';
import Head from 'next/head';
import { addToCart, getCartProduct } from '@/services/cart.service';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import SkeletonImage from '@/shared/components/skeleton/image';
import CardHeartIcon from '@/shared/icons/common/CardHeartIcon';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { useWishlists } from '@/hooks/wishlist.hooks';
import SkeletonDescription from '@/shared/components/skeleton/description';
import ProductInfoTabs from '@/features/Product/product-info-tabs';
import RelatedProducts from '@/features/Product/related-products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper';
import { useCartsHooks } from '@/hooks/cart.hooks';
import { debounce } from 'lodash';
import { getCookie } from 'cookies-next';

const COLOR_SWATCHES: Record<string, string> = {
  Black: "#111827",
  White: "#FFFFFF",
  Burgundy: "#682C3E",
  Red: "#DC2626",
  Blue: "#2563EB",
  Green: "#16A34A",
  Gold: "#D4AF37",
  Silver: "#C0C0C0",
  Brown: "#92400E",
};

const ProductSlug = () => {
  const router = useRouter()
  const { slug } = router.query;
  const token = getCookie('isLoggedIn')
  const queryClient = useQueryClient();
  const { updateCartMutation } = useCartsHooks();
  const [value, setValue] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  //for swiper carousel
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);


  const { data: cartData } = useQuery<ICartData>(['cartList'], getCartProduct);

  const { data: productData, isLoading, error } = useQuery(
    ['getProductsFromSlug', !!slug],
    async () => {
      if (slug) {
        const response = await getProductsFromSlug(slug);
        const productId = response?.id;
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
    ['relatedProducts', !!productData?.response?.categoryId],
    async () => {
      if (productData?.response?.categoryId) {
        const response = await getRelatedProductsFromId(productData?.response?.categoryId, 'asc', 'alphabet');
        return response;
      }
    }
  );

  const handleCartAction = () => {
    const payload: any = {
      quantity: value,
      productId: Number(productData?.response?.id),
      product: productData?.response,
    }
    mutation.mutate(payload)
  };

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, 'Item Added To Cart Successfully');
      queryClient.invalidateQueries(['cartList'])
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, error?.response?.data?.errors?.[0]?.message || error?.message || "Unable to update cart.")
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



  // useEffect(() => {
  //   if (cartData) {
  //     cartData?.cartProducts?.map((item: any) => {
  //       if (slug === item?.product?.slug) {
  //         setItemCartDetail(item)
  //       }
  //     })
  //   }
  // }, [slug, cartData])

  const sizes: string[] = Array.isArray(productData?.response?.sizes)
    ? productData.response.sizes
    : [];
  const colors: string[] = Array.isArray(productData?.response?.colors)
    ? productData.response.colors
    : [];

  useEffect(() => {
    if (productData) {
      setSelectedSize(productData?.response?.sizes?.[0] ?? "");
      setSelectedColor(productData?.response?.colors?.[0] ?? "");
    }
  }, [productData]);

  useEffect(() => {
    if (productData) {
      setSelectedSizeId(productData?.response?.data?.variants[0]?.id)
    }
  }, [productData])



  //to display image according to the changed size.
  const selectedImg = productData?.response?.data?.webpImages ?
    productData?.response?.data?.webpImages?.find((img: any) => img?.unit_price_id === selectedSizeId)
    : productData?.response?.data?.images?.find((img: any) => img?.unit_price_id === selectedSizeId);
  const updateCart = cartData?.cartProducts?.find((cartItem: any) => JSON.parse(cartItem?.selectedUnit?.id) === selectedSizeId) ? true : false

  const stock = Number(productData?.response?.quantity ?? 0);
  const selectedCartItems: ICartProduct | undefined = cartData?.cartProducts?.find((cart: any) => JSON.parse(cart?.selectedUnit?.id) === selectedSizeId);

  // pricing logic
  const salePrice = productData?.response?.productPrice ? productData?.response?.productPrice - (productData?.response?.productPrice * productData?.response?.discountPercentage / 100) : productData?.response?.productPrice
  const originalPrice = productData?.response?.productPrice ? productData?.response?.productPrice : salePrice




  /*  
** Provides payload to the update api when the value is being increased or decreased.
*/
  const handleUpdateCart = (newQuantity: number, itemId: number) => {
    const payload: any = {
      productId: itemId,
      quantity: newQuantity,
    }
    updateCartMutation.mutate(payload)
  };


  /**
   * Used in order to debounce the value(quantity) that is being updated.
   */
  const debouncedHandleUpdateCart = useCallback( //debounce callback to call when value changes
    debounce((newQuantity) => {
      handleUpdateCart(newQuantity, productData?.productId!)
    }, 300), [slug]
  )

  /**
   * For btn onClick function to pass the new value either being increased or decreased.
   */
  const updateCartCall = (newQuantity: number) => {
    setValue(newQuantity) //set the updated value
    debouncedHandleUpdateCart(newQuantity) //debounce callback added the updated value
  }


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
        <title>{productData?.response?.productName}</title>
      </Head>
      <Breadcrumb title={productData?.response?.productName} />
      <section className="my-[60px]">
        <div className="container">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-4">
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
                                    src={img?.imageUrl}
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
              {productData?.response?.productImageUrl && (
                <div className="flex justify-start w-full gap-2 py-2">
                  <Image alt='Product image' className='border border-primary' src={productData?.response?.productImageUrl} width={300} height={100} />
                </div>
              )}

            </div>
            <div className="col-span-12 md:col-span-7">
              {
                isLoading ? (
                  <SkeletonDescription />
                ) : (
                  <>

                    <h2 className="mb-2 text-2xl font-semibold text-slate-850">
                      {productData?.response?.productName}
                    </h2>
                    {stock > 0 ? (
                      <div className="my-3">
                        <span className="mt-5 mb-3 text-sm font-bold bg-success text-white px-2 py-1 rounded">
                          In Stock
                        </span>
                      </div>
                    ) : (
                      <div className="my-3">
                        <span className="text-sm font-bold bg-error text-white px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}


                    <p className="flex items-center gap-3 mb-2 text-sm font-bold text-slate-850">
                      Category:
                      <Link href={`/categories/${productData?.response?.categoryId}`} aria-label="category-title" className="mb-0 text-primary hover:text-orange-450">
                        <span className="font-normal">{productData?.response?.category?.categoryName}</span>
                      </Link>
                    </p>
                    <div className="flex items-center gap-2 mb-4 mt-3">
                      {productData?.response?.discountPercentage ? (
                        <>
                          <span className="text-base font-semibold text-slate-400 line-through">
                            AUD {originalPrice}
                          </span>
                          <span className="text-2xl font-bold text-primary mx-1">
                            AUD {salePrice?.toFixed(2)}
                          </span>
                          <span className="bg-[#F95F53] text-white font-bold text-xs px-2 py-1 rounded ml-1">
                            {Math.round(((productData?.response?.productPrice - salePrice) / productData?.response?.productPrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          AUD {salePrice?.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {sizes.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-3 text-sm font-bold text-slate-850">Size</p>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              aria-pressed={selectedSize === size}
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[44px] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${selectedSize === size
                                  ? "border-primary bg-primary text-white"
                                  : "border-gray-350 bg-white text-slate-850 hover:border-primary"
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {colors.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-3 text-sm font-bold text-slate-850">
                          Colour{selectedColor ? `: ${selectedColor}` : ""}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {colors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              aria-label={color}
                              title={color}
                              aria-pressed={selectedColor === color}
                              onClick={() => setSelectedColor(color)}
                              className={`h-8 w-8 rounded-full border-2 ${selectedColor === color
                                  ? "border-primary ring-2 ring-primary ring-offset-2"
                                  : "border-gray-350"
                                }`}
                              style={{ backgroundColor: COLOR_SWATCHES[color] ?? color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}


                    {/* Add to Cart Button */}
                    <div className="w-100 flex my-[30px]">
                      <div className="flex">
                        <div>
                          {
                            selectedCartItems && updateCart ?
                              <button
                                type='button'
                                onClick={handleCartAction}
                                disabled={mutation.isLoading}
                                className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100 h-[48px] text-normal hover:bg-orange-250 hover:text-base-100`}>

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
                                disabled={mutation.isLoading}
                                className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100  h-[48px] text-normal  hover:text-base-100 hover:bg-[#441b27] hover:border-[#441b27] transition-all duration-300`}>

                                + Add To Cart
                                {
                                  mutation.isLoading &&
                                  <ButtonLoader />
                                }
                              </button>
                          }
                        </div>

                      </div>
                    </div>
                    {/* {
                      token && (
                        isFavGen() ?
                          <button onClick={() => removeFromFav(productData?.response?.id)} className='flex items-center gap-3 font-normal'>
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
                          <button onClick={() => addToFav(productData?.response?.id)} className='flex items-center gap-3 font-normal'>
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
                    } */}
                  </>
                )
              }

            </div>
          </div>
        </div >
      </section >

      {productData?.response && (
        <ProductInfoTabs
          productId={productData.response.id}
          description={productData.response.productDescription || ""}
        />
      )}

      {/* Related Products */}
      {
        relatedProducts && relatedProducts?.data?.items?.length !== 0 &&
        <RelatedProducts relatedProductsLoading={relatedProductsLoading} relatedProducts={relatedProducts} />
      }
    </>
  );
}

export default ProductSlug;
ProductSlug.getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};

