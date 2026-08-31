import Link from 'next/link';
import React, { useEffect } from 'react';
import Badge from '../badge';
import CartIcon from '@/shared/icons/common/CartIcon';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getCartData, getCartProduct } from '@/services/cart.service';
import { ICartData, ICartItem } from '@/interface/cart.interface';
import { useCart as useCartStores } from '@/store/cart';
import CartDropdownProducts from './cart-products';

const CartDropdown = () => {
  const router = useRouter();


  const { coupon, setCoupon, couponData } = useCartStores();

  const { data: cart } = useQuery<ICartItem>(['getCart'], () => getCartData({ coupon }));
  const { data: cartList } = useQuery<ICartData>(['getCartList'], getCartProduct)
  //checking if there is any item which is out of stock
  const hasOutOfStock = cartList?.cartProducts.find((item) => item?.selectedUnit?.stock === 0) ? true : false
  useEffect(() => {
    if (window && localStorage && localStorage.getItem("coupon")) {
      setCoupon(localStorage.getItem("coupon") as string)
    }
  }, [window, localStorage, coupon])

  return (
    <div className='flex items-center gap-4 cursor-pointer dropdown dropdown-hover'>
      <div className="relative z-40 py-3 bg-gray-350 btn-circle shrink-0">
        <CartIcon className="mx-auto" />
        <Badge className="badge-accent" badgePosition="top-right">
          {cartList?.cartProducts?.length || 0}
        </Badge>
        {/* Total Price */}

        {/* dropdown content */}
        <div tabIndex={0} className="dropdown-content cursor-default min-w-[350px] right-[-110px] z-[2] top-[100%] p-[25px] shadow bg-base-100">
          {/* item list*/}
          <div className={`max-h-42 overflow-auto ${cartList?.cartProducts?.length === 0 ? '' : 'pb-[10px]'}`}>
            {!cartList || cartList?.cartProducts?.length === 0 ? (
              <p className="text-sm font-bold text-center text-slate-850">No Products in the cart.</p>
            ) : (
              <>
                <div className="overflow-y-scroll max-h-[350px">
                  {cartList && cartList?.cartProducts?.map((item: any, index: number) => (
                    <CartDropdownProducts item={item} key={index} />
                  ))}
                </div>
                {/* pricing list */}
                <div className="my-[25px]">
                  <p className="flex justify-between mb-1 font-medium text-gray-450">
                    Order Amount : <span>NPR {couponData?.orderAmount ? couponData?.orderAmount : cart?.orderAmount}</span>
                  </p>
                  <p className="flex justify-between mb-1 font-medium text-gray-450">
                    Subtotal : <span>NPR {couponData?.subTotal ? couponData?.subTotal : cart?.subTotal}</span>
                  </p>
                  {
                    couponData?.couponDiscount &&
                    <p className="flex justify-between mb-1 font-medium text-gray-450">
                      Coupon Discount : <span>NPR {couponData?.couponDiscount}</span>
                    </p>
                  }
                  <p className="flex justify-between mb-1 font-medium text-gray-450">
                    Delivery charge : <span>NPR {couponData?.deliveryCharge ? couponData?.deliveryCharge : cart?.deliveryCharge}</span>
                  </p>
                  <p className="flex justify-between text-slate-850">
                    Total : <span>NPR {couponData?.total ? couponData?.total : cart?.total}</span>
                  </p>
                </div>
                <div className=" [&>*:first-child]:mb-4">
                  <Link
                    href={'/cart'}
                    className="py-4 font-normal btn btn-block rounded-3xl hover:bg-primary hover:text-white"
                    onClick={() => router.push('/cart')}
                    aria-label='cart'
                  >

                    CART
                  </Link>
                  <button
                    disabled={hasOutOfStock}
                    className="py-4 font-normal btn btn-block rounded-3xl hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:pointer-events-auto "
                    onClick={() => router.push('/checkout')}
                  >
                    CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="hidden mb-1 text-sm font-bold text-gray-550 whitespace-nowrap md:block">
          TOTAL PRICE
        </p>
        <p className="text-[#222222] text-sm font-bold hidden xs:block whitespace-nowrap">
          NPR {couponData?.total ? couponData?.total : cart?.total || 0}
        </p>
      </div>
    </div>
  );
};

export default CartDropdown;
