import MainLayout from "@/shared/main-layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaKey,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa";

const AccountInfornation = () => {
  return (
    <div className="container py-10">
      <h1 className="text-2xl text-bold mb-4">Your Account</h1>
      <div className="grid grid-cols-12 gap-4 md:gap-6 ">
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="information" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaUser className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Information</p>
          </div>
        </div>
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="address" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaMapMarkerAlt className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Address</p>
          </div>
        </div>
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="oder-history" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaRegCalendarAlt className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Order History</p>
          </div>
        </div>
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="change-password" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaKey className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Change Password</p>
          </div>
        </div>
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="logout" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaSignOutAlt className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Logout</p>
          </div>
        </div>
        {/*  */}
        <div className="group col-span-12 sm:col-span-6 lg:col-span-4 py-16 px-8 relative border-solid border-grey-350 border hover:border-primary-focus">
          <Link href={``} className="w-full h-full absolute left-0 top-0" aria-label="delete-account" />
          <div className="flex flex-col w-full text-primary justify-center items-center group-hover:text-primary-focus">
            <FaTrashAlt className="text-4xl mb-4 group-hover:text-primary-focus" />
            <p className="font-semibold">Delete Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfornation;

AccountInfornation.getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};
