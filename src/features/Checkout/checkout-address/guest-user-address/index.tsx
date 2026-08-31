import { IDeliveryAddress } from '@/interface/delivery-address.interface';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const LeafletMap = dynamic(() => import('@/shared/components/leaflet'), {
    ssr: false,
  });

  interface IProps{
    guestformData: IDeliveryAddress;
    setGuestFormData:(arg1: any) => void;
}


const GuestUserAddress: React.FC<IProps> = ({guestformData, setGuestFormData}) => {
    const handleMarkerClickGuest = (lat: any, lng: any) => {
        setGuestFormData((prevData:any) => ({
          ...prevData,
          lat,
          lng,
        }));
      };

    const phoneNumberRegex = /^(97|98)\d{8}$/;
    
    return (
        <>
            <div className="h-[280px] mb-3">

                <LeafletMap
                lat={guestformData?.lat || 27.7172}
                long={guestformData.lng || 85.3240}
                onChange={handleMarkerClickGuest}
                />

                </div>
                <div className="flex flex-col col-span-12 mb-[15px]">
                <label
                htmlFor="addresstitle"
                className="block mb-2 text-sm"
                >
                {" "}
                Address Title <span className="text-red-250">*</span>
                </label>

                <input
                type="text"
                id="addresstitle"
                value={guestformData.title}
                onChange={(e) => setGuestFormData({ ...guestformData, title: e.target.value })}
                className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4`}
                required
                maxLength={80}
                pattern="^[a-zA-Z0-9, a-zA-Z0-9 ]*$"
                />
                </div>



                <label
                htmlFor="fullname"
                className="block mb-2 text-sm"
                >
                {" "}
                Full Name
                </label>

                <input
                type="text"
                id="fullname"
                value={guestformData.name}
                onChange={(e) => setGuestFormData({ ...guestformData, name: e.target.value })}
                maxLength={40}
                pattern="^[a-zA-Z ]*$"
                className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4"
                />

                <label
                htmlFor="number"
                className="block mb-2 text-sm"
                >
                {" "}
                Phone number
                </label>

                <input
                type="number"
                id="number"
                value={guestformData.mobile_number}
                onChange={(e) => setGuestFormData({ ...guestformData, mobile_number: e.target.value })}
                pattern="(9[7,8])[0-9]{8}"

                className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4"
                />
                {guestformData.mobile_number.length > 0 && !phoneNumberRegex.test(guestformData.mobile_number) && (
                <p className="pb-2 text-sm text-red-500">Incorrect phone format</p>
                )}
        </>
        
    )
}

export default GuestUserAddress