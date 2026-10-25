import React, { useCallback, useEffect, useState } from "react";
import { Props } from "./card.props";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@/shared/icons/common/SearchIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/services/cart.service";
import { ICartData, ICartItem, ICreateCartItem, IUpdateCartItem } from "@/interface/cart.interface";
import ButtonLoader from "../btn-loading";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import CardHeartIcon from "@/shared/icons/common/CardHeartIcon";
import { useWishlists } from "@/hooks/wishlist.hooks";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Tooltip from "@/components/Tooltip";

const Card: React.FC<Props> = ({ product, cartItem, setProductModalId }) => {

  //Token 
  const [logIn, setLogin] = useState<boolean>(false)
  const loggedIn = getCookie("isLoggedIn")

  //Use query hook
  const { data: cart } = useQuery<ICartData>(["getCart"]);
  const queryClient = useQueryClient();
  const stock: any = cartItem?.selectedUnit?.stock
  const { addFavMutation, removeFavMutation, addLoading, removeLoading } = useWishlists() //for adding products for wishlist ->hook

  console.log("cart", cart);
  /*
 * States 
 */
  const [quantity, setQuantity] = useState<number>(1);
  const [showProductModal, setShowProductModal] = useState<boolean>(false)
  /*
  * Handle Add to cart api call
  */
  const addToCartmutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, 'Item Added To Cart Successfully');
      queryClient.invalidateQueries(['cartList'])
      setShowProductModal(false)
      // if (router.pathname === '/wishlist') {
      //   queryClient.invalidateQueries(['wishlistProducts'])
      // }
    },
    onError: (error: any) => {
      setShowProductModal(false)
      showToast(TOAST_TYPES.error, error?.response?.data?.errors?.[0]?.message || error?.message || "Unable to update cart.")
    }
  })


  /*
  * Handle Add to cart paylod function
  */
  const handleAddToCart = () => {
    const payload: ICreateCartItem = {
      productId: product?.id,
      product,
      quantity: quantity,
    }
    addToCartmutation.mutate(payload)
    setShowProductModal(true)
    setProductModalId(product?.id?.toString() || '')
  };


  /*
  ** Provides payload to the update api when the value is being increased or decreased.
  */
  // const handleUpdateCart = (newQuantity: number, itemId: number) => {
  //   if (newQuantity <= stock) {
  //     const payload: IUpdateCartItem = {
  //       note: '',
  //       quantity: newQuantity,
  //       product_number: itemId,
  //     }
  //     updateCartMutation.mutate(payload)
  //   }
  // };

  /**
   * Used in order to debounce the value(quantity) that is being updated.
   */
  // const debouncedHandleUpdateCart = useCallback( //debounce callback to call when value changes
  //   debounce((newQuantity) => {
  //     handleUpdateCart(newQuantity, cartItem?.id!)
  //   }, 300), [cartItem]
  // )

  /**
   * For btn onClick function to pass the new value either being increased or decreased.
   */
  // const updateCartCall = (newQuantity: number) => {
  //   setQuantity(newQuantity) //set the updated value
  //   debouncedHandleUpdateCart(newQuantity) //debounce callback added the updated value
  // }

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


  /*
 ** Set Cart item updated value
*/
  useEffect(() => {
    if (cartItem?.quantity) {
      setQuantity(cartItem?.quantity)
    }
  }, [])

  useEffect(() => {
    if (loggedIn !== undefined) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [loggedIn])
  console.log("product", cart);

  return (
    <>
      <div className="relative card catholic-card">
        <Link
          href={`/products/${product?.id}`}
          className="absolute top-0 bottom-0 left-0 right-0 z-[1]"
        />
        {logIn &&
          <>
            {!product?.isFav ?
              <button onClick={() => addToFav(product?.id)} className="absolute top-3 right-3 z-[2]">
                {
                  addLoading ?
                    <ButtonLoader className="!border-primary !block" /> :
                    <CardHeartIcon />
                }
              </button>
              :
              <button onClick={() => removeFromFav(product?.id!)} className="absolute top-3 right-3 z-[2]">
                {
                  removeLoading ?
                    <ButtonLoader className="!border-primary !block" /> :
                    <CardHeartIcon className="stroke-[#E5002B] fill-[#E5002B]" />
                }
              </button>}
          </>
        }
        <figure className="relative">
          {
            product && product?.productImageUrl ? (
              <img
                src={product?.productImageUrl}
                alt={product?.productName}

                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  width: '100%',
                }}
              />
            ) : (
              <Image
                src={'/images/no-image.png'}
                alt={product?.productName}
                width={116}
                height={170}
                quality={100}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  width: '100%',
                }}
              />
            )
          }
          {
            (product?.hasDiscount && product?.discountPercentage && product?.discountPercentage > 0) &&
            <p className="absolute px-2 py-1 text-xs font-medium text-white rounded-md bottom-2 left-3 bg-red-250">Offer</p>
          }
        </figure>

        <div className="plant-card_preview-icon">
          <Link
            href={`/products/${product?.id}`}
            className="flex items-center justify-center"
          >
            <SearchIcon className="max-w-[15px] h-auto" />
          </Link>
        </div>
        <div className="card-body px-[15px] py-[15px] gap-[5px] ">
          <Tooltip text={product?.name}>
            <h2 className=" catholic-card-title uppercase">{product?.productName} sda asdasd asdads adsasd</h2>
          </Tooltip>

          <div className="flex justify-between items-center mt-2">
            {
              product?.hasDiscount && product?.discountPercentage && product?.discountPercentage > 0 ? (
                <div className="flex flex-col ">
                  <p className="flex-grow-0 mr-2 text-[18px] font-bold text-primary">
                    AUD {product?.productPrice - (product?.productPrice * product?.discountPercentage / 100)}
                  </p>
                  <p className="flex-grow-0 mr-2 text-xs font-semibold line-through text-gray-1450">
                    AUD {' '}
                    {product?.productPrice}
                  </p>
                </div>
              ) : (
                <p className="text-[18px] font-bold text-primary">
                  AUD {product?.productPrice}
                </p>
              )
            }
            
            {(!(cart?.cartProducts?.some((item: any) => item?.product.id === product?.id))) ? 
            (
              <button
                className="btn btn-primary btn-outline p-2 h-auto !min-h-0 text-xs leading-auto"
                onClick={handleAddToCart}
                disabled={addToCartmutation.isLoading}
              >
                Add to Cart
                {
                  addToCartmutation.isLoading &&
                  <ButtonLoader />
                }
              </button>
            ) 
            :
              cart?.cartProducts?.some((item: any) => item?.product.id === product?.id) && (
                // <div className="flex items-center gap-3 px-3 border rounded-lg border-primary">
                //   {
                //     quantity === 1 ?
                //       <button onClick={() => handleRemoveFromCart(cartItem?.id!)} disabled={cartDeleteLoading}>
                //         {
                //           cartDeleteLoading ? (
                //             <ButtonLoader className="!border-primary !block max-w-[18px] h-[18px]" />
                //           ) : (
                //             <TrashIcon className="max-w-[14px] h-auto" />
                //           )
                //         }
                //       </button>
                //       :
                //       <button
                //         className="text-primary py-1 text-sm w-[14px]"
                //         onClick={() => { updateCartCall(quantity - 1) }}
                //       > - </button>
                //   }
                //   <input
                //     type="text"
                //     className="text-center max-w-[35px] h-full font-bold text-sm border-0 focus:outline-0 text-primary"
                //     value={quantity}
                //     readOnly
                //     maxLength={3}
                //   />
                //   <button
                //     className="text-primary py-1 w-[14px] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
                //     onClick={() => { updateCartCall(quantity + 1) }}
                //     disabled={quantity === stock ? true : false}
                //   >
                //     +
                //   </button>
                // </div>
                <button
                  className="btn btn-primary btn-outline p-2 h-auto !min-h-0 text-xs leading-auto"
                  onClick={handleAddToCart}
                // disabled={mutation.isLoading}
                >
                  Update Cart
                  {/* {
                    mutation.isLoading &&
                    <ButtonLoader />
                  } */}
                </button>
              )}
            {/* ) */}
          </div>
        </div>
        {/* <div className='plant-card_cartBtn'>
                <Link href={'/'} className='font-bold underline uppercase bg-white text-slate-850 underline-offset-4 hover:textprimary'>Add to Cart</Link>
            </div> */}

      </div>
      {/* {showProductModal &&
        <ProductDetailModal setShowProductModal={setShowProductModal} slug={product?.slug} />
      } */}
    </>
  );
};

export default Card;
