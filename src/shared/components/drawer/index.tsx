import { logout } from "@/services/auth.service";
import BarsIcon from "@/shared/icons/common/BarsIcon";
import FlowerIcon from "@/shared/icons/common/FlowerIcon";
import LocationIcon from "@/shared/icons/common/LocationIcon";
import SearchIcon from "@/shared/icons/common/SearchIcon";
import TagIcon from "@/shared/icons/common/TagIcon";
import UserIcon from "@/shared/icons/common/UserIcon";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineLogout, AiOutlineHeart } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'
import ConfirmationModal from "../confirmation-modal";
import { getAllWishlistProducts } from "@/services/wishlist.service";

const Drawer = () => {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toggleDrawer, setToggleDrawer] = useState<boolean>(false)
  const token = getToken()
  const router = useRouter()


  const { data: favouriteList, isInitialLoading: loadingFavourite } = useQuery({
    queryKey: ["wishlistProducts", token],
    queryFn: () => getAllWishlistProducts(token),
    enabled: !!token,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      deleteCookie("token");
      deleteCookie("isLoggedIn")
      queryClient.invalidateQueries(['getCart']);
      queryClient.invalidateQueries(['getCartList']);
      showToast(TOAST_TYPES.success, "Logged out successfully");
    },
  });

  const logoutHandler = () => {
    mutation.mutate();
    setShowModal(false);
    router.push('/');
  };

  return (
    <div className="z-50 flex max-w-[8rem] drawer md:hidden">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" onClick={() => setToggleDrawer(true)} className="btn btn-ghost drawer-button">
          <BarsIcon />
        </label>
      </div>
      <div className=" drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" onClick={() => setToggleDrawer(false)}></label>
        <ul className="w-64 h-[100vh] p-4 bg-white menu text-base-content flex-nowrap">
          <div className="relative">
            <label
              htmlFor="my-drawer"
              onClick={() => setToggleDrawer(false)}
              className={`drawer-end absolute p-3 rounded-sm -top-4 right-[-3rem] btn btn-error ${toggleDrawer ? 'block' : 'hidden'}`}
            >
              x
            </label>
          </div>
          {/* Sidebar content here */}
          <li>
            <a className="mb-3 text-white rounded-md bg-primary">
              <LocationIcon />
              Location: Durbarmarg
            </a>
          </li>
          <li>
            <div className="p-0 border border-primary rounded-box !bg-white mb-3 w-full flex">
              <input
                placeholder="Search"
                className=" py-0 m-0 pe-0 !bg-transparent input max-w-[10.5rem]"
              />
              <button className="p-2 px-4 rounded-l-none -me-[1px] rounded-box btn btn-primary btn-sm">
                <SearchIcon className="max-h-[0.9rem] max-w-[0.9rem]" />
              </button>
            </div>
          </li>
          <li className="max-h-[calc(100vh-88px)] overflow-y-scroll pb-[40px]">
            <div className="!bg-transparent block p-1">
              <Link href={'/'} className="block font-normal collapse-title leading-[25px]" aria-label="home">Home</Link>
              <div className="collapse collapse-plus">
                <input type="checkbox" className="min-h-0" />
                <div className="collapse-title font-normal leading-[25px] after:!top-0 after:!right-1 pe-4 after:text-lg">
                  Our Services
                </div>
                <div className="collapse-content">
                  <p className="font-normal collapse-text"><Link href="/plant-consultation" aria-label="plant-consultant">Plant Consultant</Link></p>
                  <p className="font-normal collapse-text"><Link href="/gift-a-plant" aria-label="gift a plant">Gift a Plant</Link></p>
                </div>
              </div>
              <Link href={'/our-outlets'} className="block font-normal collapse-title leading-[25px]" aria-label="our outlets">Our Outlets</Link>
              <div className="collapse collapse-plus">
                <input type="checkbox" className="min-h-0" />
                <div className="collapse-title font-normal leading-[25px] after:!top-0 after:!right-1 pe-4 after:text-lg">
                  About Us
                </div>
                <div className="collapse-content">
                  <p className="font-normal collapse-text"><Link href="/tree-installation" aria-label="tree intsallations">Tree Installation</Link></p>
                  <p className="font-normal collapse-text"><Link href="/about-us" aria-label="our story">Our Story</Link></p>
                  <p className="font-normal collapse-text">
                    <Link href="/our-values">
                      Values that make us who we are{" "}
                    </Link>
                  </p>
                  <p className="font-normal collapse-text"><Link href="/csr-projects" aria-label="cssr-project">Our CSR Projects</Link> </p>
                </div>
              </div>
              <Link href={'/blogs'} className="block font-normal collapse-title leading-[25px]">Blog</Link>
              <div className="mt-6">
                <p className="mb-2 text-base font-bold">Our Services</p>
                {/* <Link href="/why-plants" className="flex items-center justify-start gap-3 p-0 text-base font-medium capitalize btn btn-ghost text-start" aria-label="why plants">
                  <FlowerIcon className="text-primary" />
                  Why Plants
                </Link> */}
              </div>
              <div className="mt-6">
                <p className="mb-2 text-base font-bold">My Account</p>

                {
                  token ? (
                    <>
                      <Link href="/account/profile" className="flex justify-start leading-[33px] gap-3 p-0 text-base font-normal capitalize btn btn-ghost text-start"
                        aria-label="account-profile">
                        <BiUser />
                        View Profile
                      </Link>
                      <Link href="/wishlist" className="flex justify-start leading-[33px] gap-3 p-0 text-base font-normal capitalize btn btn-ghost text-start" aria-label="wishlist">
                        <AiOutlineHeart />
                        Wishlist ({favouriteList ? favouriteList?.data?.length : 0})
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <UserIcon className="text-black" />
                      <div className="flex items-center gap-1 leading-[33px]">
                        <Link href="/login" className="flex gap-1 p-0 text-base font-normal capitalize btn btn-ghost text-start" aria-label="login">
                          Login
                        </Link>
                        <span>/</span>
                        <Link href="/register" className="flex gap-1 p-0 text-base font-normal capitalize btn btn-ghost text-start" aria-label="sign-up">
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )
                }

                <Link href="/offer" className="flex justify-start leading-[33px] gap-3 p-0 text-base font-normal capitalize btn btn-ghost text-start" aria-label="offer">
                  <TagIcon />
                  Offer
                </Link>
                {
                  token &&
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex justify-start leading-[33px] gap-3 p-0 text-base font-normal capitalize btn btn-ghost text-start">
                    {/* <TagIcon className="text-black" /> */}
                    <AiOutlineLogout />
                    Logout
                  </button>
                }

              </div>
            </div>
          </li>
        </ul >
      </div >
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
    </div >
  );
};

export default Drawer;
