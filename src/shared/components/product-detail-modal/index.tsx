import { ICartProduct } from '@/interface/product.interface'
import React, { useEffect, useState } from 'react'
import SkeletonImage from '../skeleton/image'
import Image from 'next/image'
import SkeletonDescription from '../skeleton/description'
import Link from 'next/link'
import { ITag } from '@/interface/tag.interface'
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ICartData, ICartItem, ICreateCartItem, IUpdateCartItem } from '@/interface/cart.interface'
import { addToCart, getCartData } from '@/services/cart.service'
import { getProductsFromSlug } from '@/services/product.service'
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils'
import { useWishlists } from '@/hooks/wishlist.hooks'
import ButtonLoader from '../btn-loading'
import CardHeartIcon from '@/shared/icons/common/CardHeartIcon'
import { FaTimes } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper'

interface IProductModal {
    slug: string,
    setProductModalId: (arg: string) => void
}

const ProductDetailModal = ({ slug, setProductModalId }: IProductModal) => {

    const token = getToken()
    const queryClient = useQueryClient();
    const [descriptionContent, setDescriptionContent] = useState<string>('');
    const [moreInfoContent, setMoreInfoContent] = useState<string>('');
    const [taxMessage, setTaxMessage] = useState<string>('');

    const [itemCartDetail, setItemCartDetail] = useState<ICartProduct>()
    const [value, setValue] = useState<number>(1);
    // const { updateCartLoading } = useCarts()
    //for swiper carousel
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    const { data: cartData } = useQuery<ICartItem>(['getCart'], () => getCartData({ coupon: '' }));
    const { data: cartList } = useQuery<ICartData>(['getCartList'])
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


    const handleAddToCart = () => {
        const payload: ICreateCartItem = {
            note: '',
            variant_id: selectedSizeId,
            quantity: value,
        }
        mutation.mutate(payload)
    };

    const mutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Item Added To Cart Successfully');
            queryClient.invalidateQueries(['getCartList'])
            queryClient.invalidateQueries(['getCart'])
            setProductModalId('')
        },
        onError: (error: any) => {
            showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message)
        }
    })

    // const updateCartMutation = useMutation({
    //     mutationFn: updateCart,
    //     onSuccess: () => {
    //         showToast(TOAST_TYPES.success, 'Item Updated To Cart Successfully');
    //         queryClient.invalidateQueries(['getCart'])
    //         setProductModalId("")
    //     },
    //     onError: (error: any) => {
    //         showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message);
    //     }
    // })
    // //updateCart function
    // const updateCartHandler = () => {
    //     if (value <= stock) {
    //         const payload: IUpdateCartItem = {
    //             note: '',
    //             quantity: value,
    //             product_number: selectedCartItems?.id || itemCartDetail?.id || productData?.productId
    //         }
    //         updateCartMutation.mutate(payload)
    //     }
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
            cartList?.cartProducts?.map((item: any) => {
                if (slug === item?.product?.slug) {
                    setItemCartDetail(item)
                }
            })
        }
    }, [slug, cartData])

    useEffect(() => {
        if (productData) {
            setDescriptionContent(productData?.response?.data?.description || '');
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

    useEffect(() => {
        setValue(1)
    }, [selectedSizeId])

    //For checking if the selected size and the mapped pricec are equal to show the change in price
    const selectedPrice = productData?.response?.data?.variants?.find((price: any) => price?.id === selectedSizeId);

    //to display image according to the changed size.
    const selectedImg = productData?.response?.data?.images.find((img: any) => img?.unit_price_id === selectedSizeId);
    const updatedCart = cartList?.cartProducts?.find((cartItem: any) => JSON.parse(cartItem?.selectedUnit?.id) === selectedSizeId) ? true : false

    //checking stock for each product/sku element
    const stock: any = productData?.response?.data?.variants?.find((price: any) => price?.id === selectedSizeId)?.stock

    const selectedCartItems: ICartProduct | undefined = cartList?.cartProducts?.find((cart: any) => JSON.parse(cart?.selectedUnit?.id) === selectedSizeId);

    useEffect(() => {
        if (updatedCart) {
            setValue(selectedCartItems?.quantity!)
        } else {
            setValue(1)
        }
    }, [selectedCartItems, selectedSizeId])

    return (
        <>
            <input type="checkbox" id='productDetailModal' className="modal-toggle" defaultChecked />
            <div className="modal z-[9999]">
                <div className="w-6/12 max-w-5xl rounded-lg lg:w-11/12 modal-box">
                    <div className='flex items-center justify-between'>
                        <h3 className="text-lg font-bold"></h3>
                        <button onClick={() => setProductModalId('')}><FaTimes /></button>
                    </div>
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
                                                    <Image alt='Product image' src={selectedImg?.imageName} width={90} height={90} />
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
                                        <p className="flex items-center gap-3 mb-2 text-sm font-bold color-slate-850">
                                            Category:
                                            <Link href={`/category/${productData?.response?.data?.categorySlug}`} aria-label="category-title" className="mb-0 text-primary hover:text-orange-450">
                                                <span className="font-normal">{productData?.response?.data?.restaurantName}</span>
                                            </Link>
                                        </p>
                                        {
                                            productData?.response?.data?.tags.length > 0 &&
                                            <p className="flex items-center gap-3 mb-2 text-sm font-bold color-slate-850">
                                                Tags:
                                                {productData?.response?.data?.tags.map((prev: ITag, index: number) => (
                                                    <Link href={`/tag?id=${prev?.slug}`} aria-label="tag-title" className="mb-0 capitalize text-primary hover:text-orange-450" key={`tag-${index}`}>
                                                        <span className="font-normal">{prev?.name}</span>
                                                    </Link>
                                                ))}
                                            </p>
                                        }
                                        <ul className="flex my-5">

                                            {
                                                selectedPrice && selectedPrice?.hasOffer ? (
                                                    <>
                                                        <li className="mr-1 text-base text-red-250">
                                                            NPR
                                                            <span>
                                                                {selectedPrice?.newPrice * value}
                                                            </span>
                                                        </li>

                                                        <li className="mr-1 text-base font-semibold line-through text-primary">
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
                                            <li className="text-base font-semibold text-primary ">
                                                ( <span dangerouslySetInnerHTML={{ __html: taxMessage }} />)
                                            </li>
                                        </ul>

                                        <p className='font-normal' dangerouslySetInnerHTML={{ __html: selectedPrice?.description, }} />

                                        {
                                            unitPriceArray?.length > 1 &&
                                            <div className='mt-3'>
                                                <p className='mb-3 text-lg font-bold text-slate-850'>Size</p>
                                                <select name="" id=""
                                                    value={selectedSizeId}
                                                    onChange={(e) => setSelectedSizeId(JSON.parse(e.target.value))}
                                                    className='px-3 py-1 w-[175px] focus:outline-none text-lg border rounded-[4px] border-primary text-slate-850'>
                                                    {
                                                        unitPriceArray?.map((size: any, index: number) => (
                                                            <option key={index} value={size?.id}><p>{size?.size}</p></option>
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
                                                    itemCartDetail && updatedCart ?
                                                        <button
                                                            type='button'
                                                            onClick={handleAddToCart}
                                                            disabled={mutation.isLoading || selectedPrice?.stock === 0}
                                                            className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100 ml-2.5 h-[48px] text-sm hover:bg-orange-250 hover:text-base-100`}>

                                                            + Update To Cart
                                                            {
                                                                mutation.isLoading &&
                                                                <ButtonLoader />
                                                            }
                                                        </button>
                                                        :
                                                        <button
                                                            type='button'
                                                            onClick={handleAddToCart}
                                                            disabled={mutation.isLoading || selectedPrice?.stock === 0}
                                                            className={`${mutation.isLoading && 'opacity-70 '} disabled:cursor-not-allowed flex items-center gap-4 relative px-[55px] font-bold uppercase rounded-[30px] bg-accent text-base-100 ml-2.5 h-[48px] text-sm hover:bg-orange-250 hover:text-base-100`}>

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
                                                    <button onClick={() => removeFromFav(productData?.productId)} className='flex items-center gap-3'>
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
                                                    <button onClick={() => addToFav(productData?.productId)} className='flex items-center gap-3'>
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
                </div>
            </div>
        </>
    )
}

export default ProductDetailModal