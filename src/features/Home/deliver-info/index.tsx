import React from 'react'
import Image from "next/image";

import { DeliveryImg, LockImg, CallImg } from "@/shared/lib/image-config";
import Title from '@/shared/components/title';

const DeliverInfo = () => {
  return (
    <div className="border bg-[#f1f1f1] rounded rounded-xs px-[20px]">
              <div className="grid grid-cols-1 sm-grid-cols-2 md:grid-cols-3 ">
                <div className="flex items-start px-[20px] py-[20px] md:py-[35px] relative gap-0">
                  <Image
                    src={DeliveryImg}
                    alt="Static Image"
                    width={50}
                    height={50}
                    className="w-[45px] mr-[10px]"
                  />
                  <Title
                    type="title-section"
                    className="text-slate-850 font-semibold text-normal capitalize leading-[22px] mb-0"
                    text="Free Shipping"
                    subTitle="Get plants delivered to your doorstep without hassle!"
                    subClassName="leading-[20px] text-gray-650 font-normal text-[13px]"
                    mb="0"
                  />
                </div>
                <div className="flex items-start  px-[20px] py-[20px] md:py-[35px] relative gap-0">
                  <Image
                    src={LockImg}
                    alt="Static Image"
                    width={50}
                    height={50}
                    className="w-[45px] mr-[10px]"
                  />
                  <Title
                    type="title-section"
                    className="text-slate-850 font-semibold text-normal capitalize leading-[22px] mb-0"
                    text="100% Payment Secure"
                    subTitle="Your payment are safe with us"
                    subClassName="leading-[20px] text-gray-650 font-normal text-[13px]"
                    mb="0"
                  />
                </div>
                <div className="flex items-start  px-[20px] py-[20px] md:py-[35px] relative gap-0">
                  <Image
                    src={CallImg}
                    alt="Static Image"
                    width={50}
                    height={50}
                    className="w-[45px] mr-[10px]"
                  />
                  <Title
                    type="title-section"
                    className="text-slate-850 font-semibold text-normal capitalize leading-[22px] mb-0"
                    text="Support 10 Am - 6 Pm"
                    subTitle="We are available all week from 10 Am to 6 Pm"
                    subClassName="leading-[20px] text-gray-650 font-normal text-[13px]"
                    mb="0"
                  />
                </div>
              </div>
            </div>
  )
}

export default DeliverInfo