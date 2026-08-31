import React, { useState } from "react";
import { NextPageWithLayout } from "./_app";
import MainLayout from "@/shared/main-layout";
import Title from "@/shared/components/title";
import {
  DeliveryImg,
  LockImg,
  CallImg,
} from "@/shared/lib/image-config";
import Image from "next/image";
import Banner from "@/shared/components/banner";
import Categories from "@/features/Home/categories";

import AppCategories from "@/features/Home/app-categories";
import { useQuery } from "@tanstack/react-query";
import { IAdBanner, IAppCategories, IHome } from "@/interface/home.interface";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import Head from "next/head";
import AdBanner from "@/shared/components/ad-banner";
import { getBannerPopup } from "@/services/home.service";
import { getCookie } from "cookies-next";
import BannerPopup from "@/features/Home/banner-popup";

const Home: NextPageWithLayout = () => {
  const [showPopupModal, setShowPopupModal] = useState<boolean>(true)
  const { data: home, isInitialLoading: homeLoading } = useQuery<IHome>({
    queryKey: ["getHomeData"],
  });
  // const { data: cart } = useQuery<ICartItem>(['getCart'], () => getCartData({ coupon }))
  const { data: categories, isInitialLoading: loadingCategories }: any = useQuery({ queryKey: ['getCategoriesList'] });

  // useEffect(() => {
  //   if (!getCookie(CookieKeys.CARTNUMBER)) {
  //     setCartNumberCookie()
  //   }
  // }, [])
  const adBanners = home?.data?.adBanners || [];
  const { data: bannerPopupData, isLoading: bannerPopupLoading } = useQuery(['getBannerPopup'], getBannerPopup)
  const bannerPop = getCookie("bannerPopup")

  return (
    <>
      <Head>
        <title></title>

      </Head>
      <div className="text-lg font-bold">
        <Banner />
        <div className="container my-6">
          <div className="border border-orange-450 rounded rounded-xs px-[20px]">
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
          <Categories
            loading={loadingCategories}
            categories={categories?.data}
          />
          {adBanners.length > 0 &&
            <div className="grid grid-cols-12 gap-4 my-6">
              {adBanners?.slice(0, 2).map((bannerImg: IAdBanner) => (
                <div className="col-span-12 overflow-hidden sm:col-span-6" key={bannerImg?.id}>
                  <AdBanner adBanner={bannerImg} />
                </div>
              ))}
            </div>
          }

        </div>
        {homeLoading ?
          <div className="container my-6">
            <div className="w-20 h-5 mx-4 mb-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((index) => (
                <SkeletonLoadingCard
                  key={`app-skeleton-${index}`}
                />
              ))}
            </div>
          </div>
          :
          <>
            {home?.data?.appCategories?.map((prev: IAppCategories, index: number) => (
              <React.Fragment
                key={`appcatgories-${index}`}
              >
                <AppCategories
                  prev={prev}
                />
                {
                  index * 2 + 2 < home?.data?.adBanners.length &&
                  <div className="container">
                    <div className="grid grid-cols-12 gap-4 my-6">
                      {home?.data?.adBanners
                        .slice((index * 2) + 2, (index + 1) * 2 + 2) // Display 2 adBanners after each AppCategories set
                        .map((adBanner: IAdBanner) => (
                          <div className="relative col-span-12 overflow-hidden sm:col-span-6" key={adBanner?.id}>
                            <AdBanner adBanner={adBanner} />
                          </div>
                        ))}
                    </div>

                  </div>
                }
              </React.Fragment>
            )
            )}
          </>
        }
        {
          bannerPopupData?.data.length > 0 && showPopupModal && (bannerPop !== (undefined || true)) &&
          <BannerPopup
            setShowPopupModal={setShowPopupModal}
            popupData={bannerPopupData?.data[0]!}
            bannerPopupLoading={bannerPopupLoading}
          />
        }
      </div>
    </>
  );
};
export default Home;
Home.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};
