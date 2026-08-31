import { deleteAccount, logout } from "@/services/auth.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaAddressBook, FaShoppingBag, FaSignOutAlt, FaTrashAlt, FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from 'react-icons/ri'
import ConfirmationModal from "../confirmation-modal";
import ProfileImage from "@/features/ProfileImage";

const AccountSidebar = () => {
  const { pathname } = useRouter()
  const queryClient = useQueryClient()
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDelAccModal, setShowDelAccModal] = useState<boolean>(false);

  const listItemClass = `group text-gray-400 relative p-4 flex gap-2 items-center border-none md:border-b border-gray-350 border-solid text-[14px]`;
  const linkClass = "absolute top-0 left-0 w-full h-full";
  const iconClass = "group-hover:text-primary-focus w-5 h-auto md:w-auto";
  const linkUrls = [
    { href: `/account/profile`, icon: <FaUserAlt className={iconClass} />, text: "ACCOUNT DETAILS" },
    { href: `/account/order`, icon: <FaShoppingBag className={iconClass} />, text: "ORDER HISTORY" },
    { href: `/account/change-password`, icon: <RiLockPasswordFill className={iconClass} />, text: "CHANGE PASSWORD" },
    { href: `/account/addresses`, icon: <FaAddressBook className={iconClass} />, text: "MY ADDRESS" },
  ];

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      deleteCookie("token");
      deleteCookie("isLoggedIn");
      queryClient.invalidateQueries(['getCart']);
      queryClient.invalidateQueries(['getCartList']);
      router.push('/login')
      showToast(TOAST_TYPES.success, "Logged out successfully");
    },
  });

  const delAccMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      deleteCookie("token");
      deleteCookie("isLoggedIn");
      queryClient.invalidateQueries(['getCart']);
      queryClient.invalidateQueries(['getCartList']);
      showToast(TOAST_TYPES.success, data?.data?.message);
      router.push('/login');
    },
  });

  const logoutHandler = () => {
    mutation.mutate();
    setShowModal(false);
    router.push('/');
  };

  const deleteAccountHandler = () => {
    delAccMutation.mutate();
    setShowDelAccModal(false);
  };

  return (
    <div className="py-6">
      <div className="pb-4 border-b border-gray-350">
        <ProfileImage />


      </div>
      <ul className="[&>:active]:text-primary flex md:block justify-around border-b border-gray-350 border-solid ">
        {linkUrls.map((link, index) => (
          <li key={index} className={`${listItemClass} ${pathname === link.href && 'text-primary'}`}>
            <Link href={link.href} className={linkClass} aria-label="link-title"></Link>
            {link.icon}
            <span className={`${iconClass} hidden md:block`}>{link.text}</span>
          </li>
        ))}
        <li>
          <button className={listItemClass} onClick={() => setShowModal(true)}>
            <FaSignOutAlt className={iconClass} />
            <span className={`${iconClass} hidden md:block`}>Logout</span>
          </button>
        </li>
        <li>
          <button className={listItemClass} onClick={() => setShowDelAccModal(true)}>
            <FaTrashAlt className={iconClass} />
            <span className={`${iconClass} hidden md:block`}>Delete Account</span>
          </button>
        </li>
      </ul>
      {showModal && (
        <ConfirmationModal
          confirmHeading="Are you sure you want to logout?"
          modalType="logout_modal"
          btnName="Logout"
          showModal={showModal}
          btnFunction={logoutHandler}
          cancelFuntion={() => setShowModal(false)}
          isLoading={mutation.isLoading}
        />
      )}
      {showDelAccModal && (
        <ConfirmationModal
          confirmHeading="Are you sure you want to delete your account?"
          modalType="delete_account_modal"
          btnName="Delete"
          showModal={showDelAccModal}
          btnFunction={deleteAccountHandler}
          cancelFuntion={() => setShowDelAccModal(false)}
          isLoading={mutation.isLoading}
        />
      )}
    </div>
  );
};

export default AccountSidebar;