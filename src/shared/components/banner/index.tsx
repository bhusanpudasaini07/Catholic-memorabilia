import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import { useQuery } from "@tanstack/react-query";
import { IHome } from "@/interface/home.interface";
import BannerSkeletonLoader from "../skeleton/banner";
import { getHomeData } from "@/services/home.service";

const Banner = () => {
  const { data: homeData, isInitialLoading } = useQuery<IHome>({
    queryKey: ["getHomeData"],
    queryFn: () => getHomeData(),
    enabled: true
  });

  const handleOpenNewTab = (value: any) => {
    window.open(value, '_blank');
  };

  return (
    <div>
      {
        isInitialLoading ?
          <BannerSkeletonLoader /> :

          <>
            {homeData && homeData?.data && homeData?.data?.banners &&
              <Swiper
                loop={true}
                className="bannerSwiper aspect-[640/266]"
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                centeredSlides={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
              >
                {homeData?.data?.banners.map((prev, index) => (
                  <SwiperSlide key={`banner-images-${index}`} onClick={() => handleOpenNewTab(`${prev.websiteUrl}`)}>
                    <Image
                      src={prev?.webpBannerImage ? prev?.webpBannerImage : prev.bannerImage}
                      height={100}
                      width={2000}
                      style={{ objectFit: "cover" }}
                      alt={prev.type}
                      priority
                      quality={100}
                    />
                  </SwiperSlide>
                ))
                }

              </Swiper>}
          </>
      }
    </div>
  );
};

export default Banner;
