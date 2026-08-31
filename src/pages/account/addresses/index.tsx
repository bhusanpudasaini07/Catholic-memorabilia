import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React, { useState } from "react";
import { IDeliveryAddress } from "@/interface/delivery-address.interface";
import DeliveryAddressModal from "@/shared/components/delivery-address-modal";
import Address from "@/features/Address";

const DelieveryAddress = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number]>([28.3949, 84.1240]); // Coordinates for Nepal
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IDeliveryAddress>({
    address: '',
    mobile_number: '',
    name: '',
    default: false,
    lat: 27.7172,
    lng: 85.3240,
    title: ''
  });
  return (
    <>
      <Head>
        <title> | Address</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-gray-350 border-solid">
        Select Delivery Address
      </h5>
      <div className="grid grid-cols-12 p-4 gap-5">

        {showModal && (
          <>
            <DeliveryAddressModal
              formData={formData}
              setFormData={setFormData}
              setShowModal={setShowModal}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </>
        )}
        <Address 
        formData={formData}
        setFormData={setFormData}
          setShowModal={setShowModal}
          setIsEditing={setIsEditing}
          showModal={showModal}/>
      </div>
    </>
  );
};

export default DelieveryAddress;

DelieveryAddress.getLayout = (page: any) => {
  return <MainLayout>
    <AccountSidebarLayout>{page}</AccountSidebarLayout>
  </MainLayout>;
};
