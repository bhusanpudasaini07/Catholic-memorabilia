import Link from 'next/link';
import React from 'react';
import { NextPageWithLayout } from '../_app';
import MainLayout from '@/shared/main-layout';
import Title from '@/shared/components/title';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import CartTableRow from '@/features/Cart/cart-table-row';
import EmptyCart from '../../shared/components/empty-content/empty-cart';
import { useCartsHooks } from '@/hooks/cart.hooks';
import ButtonLoader from '@/shared/components/btn-loading';

import { getCartProduct } from '@/services/cart.service';
import { useRouter } from 'next/router';
import BreadcumbsBanner from '@/shared/components/breadcumbs-banner';



const Cart: NextPageWithLayout = () => {
  const router = useRouter()

  const { data: cartData } = useQuery({
    queryKey: ['cartList'],
    queryFn: getCartProduct,
  });

  const { bulkCartDelete, bulkDeleteLoading } = useCartsHooks();

  const clearCart = () => {
    bulkCartDelete.mutate();
  };

  //checking if there is any item which is out of stock
  const hasOutOfStock = cartData?.items?.find((item: any) => item?.product?.quantity === 0) ? true : false

  
  return (
    <>
      <Head>
        <title> | Cart</title>
      </Head>
      {cartData?.items?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <BreadcumbsBanner />
          <div className="container my-[60px]">
            <Title type="" className="text-2xl text-slate-850 font-semibold mb-[30px]" text="Your cart Items" />
            <div className="grid grid-cols-12 gap-10" >
              <div className="col-span-8">
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
                      {cartData?.items?.map((item: any, index: number) => (
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
              </div>
              <div className="col-span-4">

                <div className="flex flex-col md:flex-row gap-[40px] items-start justify-between mb-4">

                  <div className="checkout-card">
                    <div className="checkout-card-header">
                      <h4 className="inline-block text-lg pr-[18px] bg-slate-250 text-slate-850 relative font-bold z-[2] leading-[20px]">
                        Cart Total
                      </h4>
                    </div>
                    <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                      <p className="text-sm font-semibold">Total products</p>
                      <p className="text-lg font-bold">{ cartData?.totalItems}</p>
                    </div>
                  
                    <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                      <p className="text-sm font-semibold">Subtotal</p>
                      <p className="text-lg font-bold">AUD { cartData?.subTotal ? cartData?.subTotal : cartData?.totalAmount}</p>
                    </div>
                    <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                      <p className="text-sm font-semibold">Delivery Charge</p>
                      <p className="text-lg font-bold">AUD { cartData?.shippingCharge ? cartData?.shippingCharge : cartData?.shippingCharge || 0}</p>
                    </div>
                    <div className="flex items-center justify-between w-full mb-[20px] text-primary">
                      <p className="text-xl font-bold">Grand Total</p>
                      <p className="text-xl font-bold">AUD { cartData?.netPayableAmount ? cartData?.netPayableAmount : cartData?.totalAmount}</p>
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
