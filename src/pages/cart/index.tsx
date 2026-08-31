import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '../_app';
import MainLayout from '@/shared/main-layout';
import Title from '@/shared/components/title';
import { ICartData, ICartItem, ICouponCartData, ICouponCartError } from '@/interface/cart.interface';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import CartTableRow from '@/features/Cart/cart-table-row';
import EmptyCart from '../../shared/components/empty-content/empty-cart';
import { useCartsHooks } from '@/hooks/cart.hooks';
import ButtonLoader from '@/shared/components/btn-loading';
import { useCart as useCartStore } from '@/store/cart';

import { addCouponCode, getCartData, getCartProduct } from '@/services/cart.service';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import { useRouter } from 'next/router';

enum COUPON_METHODS {
  ADD_COUPON = 'Apply Coupon',
  DELETE_COUPON = 'Remove Coupon',
}

const Cart: NextPageWithLayout = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const [tempCoupon, setTempCoupon] = useState('');

  const { coupon, setCoupon, setCouponData, couponData } = useCartStore();

  const [couponText, setCouponText] = useState<COUPON_METHODS>(COUPON_METHODS.ADD_COUPON);
  const { data: cart } = useQuery<ICartItem>(['getCart'], () => getCartData({ coupon }));
  const { data: cartData } = useQuery<ICartData>(['getCartList'], getCartProduct);
  const { bulkCartDelete, bulkDeleteLoading } = useCartsHooks();

  const { data: couponCartData, isError, error: couponCartError } = useQuery<ICouponCartData, ICouponCartError[]>({
    queryKey: ['addCoupon', coupon],
    queryFn: async () => addCouponCode(coupon),
    enabled: !!coupon,
  })

  const clearCart = () => {
    bulkCartDelete.mutate();
  };

  //checking if there is any item which is out of stock
  const hasOutOfStock = cartData?.cartProducts.find((item) => item?.selectedUnit?.stock === 0) ? true : false

  const handleApplyCoupon = () => {
    setCoupon(tempCoupon);
    localStorage.setItem('coupon', tempCoupon);
    setCouponText(COUPON_METHODS.DELETE_COUPON);
    queryClient.invalidateQueries(['getCouponCart']);
  };

  const handleRemoveCoupon = () => {
    if (localStorage.getItem('coupon')) {
      localStorage.removeItem('coupon');
    }
    setCouponText(COUPON_METHODS.ADD_COUPON);
    setCoupon('');
    setTempCoupon('');
    setCouponData({})
    queryClient.invalidateQueries(['getCart']);
  };

  useEffect(() => {
    if (window && localStorage && localStorage.getItem('coupon')) {
      setTempCoupon(localStorage.getItem('coupon') as any);
      setCoupon(localStorage.getItem('coupon') as any)
      setCouponText(COUPON_METHODS.DELETE_COUPON);
    }
  }, [localStorage, window]);

  /**
   * when coupon api throws error
   */
  useEffect(() => {
    if (isError && couponCartError) {
      showToast(TOAST_TYPES.error, couponCartError[0]?.title)
      if (localStorage.getItem('coupon')) {
        localStorage.removeItem('coupon');
      }
      setCouponText(COUPON_METHODS.ADD_COUPON);
      setCoupon('');
      setTempCoupon('');
      queryClient.invalidateQueries(['getCart']);
    }
  }, [isError])

  useEffect(() => {
    if (couponCartData) {
      setCouponData(couponCartData)
    }
  }, [couponCartData])

  return (
    <>
      <Head>
        <title> | Cart</title>
      </Head>
      {cartData?.cartProducts?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="product-page-banner">
            <div className="container">
              <h2 className="text-slate-850 text-[30px] capitalize font-semibold">Cart</h2>
              <div className="text-base breadcrumbs">
                <ul className="justify-center">
                  <li>
                    <Link href="/" className="text-slate-850 transition-all delay-150 duration-300 hover:!no-underline hover:text-primary">
                      Home
                    </Link>
                  </li>
                  {/* <li><Link href={'#'}>Documents</Link></li> */}
                  <li className="text-slate-850">Cart</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container my-[60px]">
            <Title type="" className="text-2xl text-slate-850 font-semibold mb-[30px]" text="Your cart Items" />
            <div className="overflow-x-auto">
              <table className="table border cart-table border-gray-350">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>QTY</th>
                    <th>Sub Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.cartProducts?.map((item: any, index: number) => (
                    <CartTableRow item={item} key={index} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row gap-[10px] items-start sm:items-center justify-between mt-[30px] mb-[60px]">
              <Link
                href="/"
                className="btn btn-tertiary font-bold px-[63px] py-[17px] rounded-[50px] text-slate-850 text-sm uppercase leading-[1] hover:btn-primary hover:text-white">
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                disabled={bulkDeleteLoading}
                className="btn btn-tertiary font-bold px-[63px] py-[17px] rounded-[50px] text-slate-850 text-sm uppercase leading-[1] hover:btn-primary hover:text-white">
                Clear Shopping Cart
                {bulkDeleteLoading && <ButtonLoader />}
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-[40px] items-start justify-between mb-[60px]">
              <div className="checkout-card w-full sm:w-[370px]">
                <div className="checkout-card-header">
                  <h4 className="inline-block text-lg pr-[18px] bg-slate-250 text-slate-850 relative font-bold z-[2] leading-[20px]">
                    Use Coupon Code
                  </h4>
                </div>
                <div className="mt-[20px]">
                  <p className="text-sm mb-4 leading-[24px]">Enter your coupon code if you have one.</p>
                  <form>
                    <input
                      type="text"
                      value={tempCoupon}
                      disabled={couponText === COUPON_METHODS.DELETE_COUPON ? true : false}
                      onChange={(e) => setTempCoupon(e.target.value)}
                      className="bg-white border border-gray-350 h-[45px] mb-[30px] pl-2.5 w-full focus:outline-0 disabled:opacity-70 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                    {couponText === COUPON_METHODS.ADD_COUPON ? (
                      <button
                        onClick={handleApplyCoupon}
                        type="button"
                        disabled={tempCoupon === '' || tempCoupon === null}
                        className="disabled:cursor-not-allowed disabled:pointer-events-auto btn btn-primary text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white">
                        {couponText}
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        type="button"
                        className=" btn btn-primary text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white">
                        {couponText}
                      </button>
                    )}
                  </form>
                </div>
              </div>
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h4 className="inline-block text-lg pr-[18px] bg-slate-250 text-slate-850 relative font-bold z-[2] leading-[20px]">
                    Cart Total
                  </h4>
                </div>
                <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                  <p className="text-sm font-semibold">Total products</p>
                  <p className="text-lg font-bold">NPR {couponData?.orderAmount ? couponData?.orderAmount : cart?.orderAmount}</p>
                </div>
                {

                  couponData?.couponDiscount &&
                  <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                    <p className="text-sm font-semibold">Coupon Discount</p>
                    <p className="text-lg font-bold">
                      NPR {couponData?.couponDiscount}
                    </p>
                  </div>
                }
                <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                  <p className="text-sm font-semibold">Subtotal</p>
                  <p className="text-lg font-bold">NPR {couponData?.subTotal ? couponData?.subTotal : cart?.subTotal}</p>
                </div>
                <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                  <p className="text-sm font-semibold">Delivery Charge</p>
                  <p className="text-lg font-bold">NPR {couponData?.deliveryCharge ? couponData?.deliveryCharge : cart?.deliveryCharge}</p>
                </div>
                <div className="flex items-center justify-between w-full mb-[20px] text-primary">
                  <p className="text-xl font-bold">Grand Total</p>
                  <p className="text-xl font-bold">NPR {couponData?.total ? couponData?.total : cart?.total}</p>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  disabled={hasOutOfStock}
                  className="disabled:cursor-not-allowed disabled:pointer-events-auto btn btn-primary text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white w-full">
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;

Cart.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
