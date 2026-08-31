import { IPaymentMethod } from '@/interface/home.interface';
import { getConfig } from '@/services/home.service';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
interface CheckoutPaymentProps {
    selectedPayment: IPaymentMethod | null;
    handlePaymentChange: (payment: IPaymentMethod) => void;
}
const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({ selectedPayment, handlePaymentChange }) => {
    //Get Config Data
    const { data: config, isInitialLoading } = useQuery({
        queryKey: ["getConfig"],
        queryFn: getConfig,
    });
    return (
        <>
            {config?.data?.paymentMethods?.map((payment: IPaymentMethod) => (
                <div className="form-control" key={payment.id}>
                    <label className="justify-start cursor-pointer label">
                        <input
                            type="radio"
                            name="radio-10"
                            className="radio checked:bg-primary w-[18px] h-[18px]"
                            checked={selectedPayment?.id === payment.id}
                            onChange={() => handlePaymentChange(payment)}
                        />
                        <div className="flex">
                            <Image
                                alt="Checkout Img"
                                width={50}
                                height={50}
                                quality={100}
                                src={payment?.webpIcon ? payment?.webpIcon :  payment?.icon}
                                className="w-[30px] mx-3"
                            />
                            <span className="capitalize">{payment.title}</span>
                        </div>
                    </label>
                </div>
            ))}
        </>

    )
}

export default CheckoutPayment