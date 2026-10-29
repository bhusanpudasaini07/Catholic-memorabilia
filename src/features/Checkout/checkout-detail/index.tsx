import { IPaymentMethod, PaymentFormProps } from '@/interface/home.interface';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

interface CheckoutDetailProps {
  selectedPayment: IPaymentMethod | null;
  deliveryCharge?: number;
}

const CheckoutDetail: React.FC<CheckoutDetailProps> = ({ selectedPayment, deliveryCharge }) => {
  // Selected payment method

  // const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);
  //Get cart Data
  const { data: cart } = useQuery<any>(["cartList"]);


  return (
    <>
      <div className="py-[38px] px-[45px] bg-slate-150">
        <ul className="flex justify-between font-bold text-[16px] text-slate-850">
          <li>Product</li>
          <li>Total</li>
        </ul>
        <div className="my-[29px] py-[18px] border-t-[1px]  border-b-[1px] border-light-gray border-solid">
          <ul className="">
            {cart?.items?.map((productData: any, index: any) => (
              <li className="flex justify-between" key={index}>
                <span> {productData?.product?.productName} X {productData?.quantity} </span>
                <span>AUD {productData?.totalPrice || 0} </span>
              </li>

            ))}
          </ul>
        </div>
        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Order Amount
          </li>
          <li className="text-[14px]">AUD {cart?.totalAmount || 0}</li>
        </ul>
        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Cart Subtotal
          </li>
          <li className="text-[14px]">AUD {cart?.subTotal || 0}</li>
        </ul>

        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Discount 
          </li>
          <li className="text-[14px]">AUD {cart?.totalDiscountAmount || 0}</li>
        </ul>
        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Delivery Charge
          </li>
          <li className="text-[14px]">AUD {deliveryCharge || cart?.delivery || 0}</li>
        </ul>
        <div className="mt-[18px] mb-[33px] py-[18px] border-t-[1px]  border-b-[1px] border-light-gray border-solid">
          <ul className=" flex justify-between mb-[20px]">
            <li className="font-bold text-[18px]">Total</li>
            <li className="font-bold text-primary">AUD {deliveryCharge ? (cart?.totalAmount + Number(deliveryCharge)).toFixed(2) : cart?.totalAmount || 0}</li>
          </ul>
          <ul className="flex justify-between">
            <li className="font-bold text-[18px]">Payment method</li>
            {selectedPayment && (
              <li className="font-bold text-[16px] text-gray-650">
                {selectedPayment.title}
              </li>
            )}
          </ul>
        </div>
      </div>
    </>

  )
}

export default CheckoutDetail