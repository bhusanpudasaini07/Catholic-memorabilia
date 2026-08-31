import { ICartData, ICartItem } from "@/interface/cart.interface";
import { IAppCategories } from "@/interface/home.interface";
import { getCartData } from "@/services/cart.service";
import Card from "@/shared/components/card";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import Title from "@/shared/components/title";
import { CardImg } from "@/shared/lib/image-config";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Grid } from 'swiper';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HalfLeftCard from "./half-left-card";
import ProductDetailModal from "@/shared/components/product-detail-modal";
interface IProps {
  prev: IAppCategories;
}

const AppCategories: React.FC<IProps> = ({ prev }) => {
  const token = getToken();
  const [nextDisable, setNextDisable] = useState<boolean>(false)
  const [prevDisable, setPrevDisable] = useState<boolean>(false)
  const [productModalId, setProductModalId] = useState<string>("")

  const { data: cart } = useQuery<ICartData>(['getCartList']);
  const { data: favList }: any = useQuery<any>(["wishlistProducts", token], { enabled: !!token });

  const updatedData = prev?.product?.map(item => ({
    ...item,
    isFav: favList && favList.data.length > 0 ? favList?.data.some((favItem: any) => favItem.product_id === item.id) : false,
    favId: favList && favList.data.length > 0 ? favList?.data.find((favItem: any) => favItem.product_id === item.id)?.id : 0
  }
  ));

  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  //handling prev and next of swiper category
  const handlePrevious = useCallback(() => {
    setNextDisable(false)
    if (swiperRef) {
      swiperRef?.slidePrev();
    }
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    setPrevDisable(false)
    if (swiperRef) {
      swiperRef?.slideNext();
    }
  }, [swiperRef]);

  return (
    <>
      {
        !prev?.product ? '' : (
          prev?.type === 'half left' ?
            <HalfLeftCard updatedData={prev} /> :
            (
              <div className="container">
                <section className="my-[60px]">
                  <div className="relative flex items-center justify-between">
                    <Title type="title-section" text={prev?.title} />
                    {
                      prev?.product?.length > 0 && (
                        <div className='!static productSwiper-navigation mb-[45px]'>
                          <button
                            disabled={prevDisable}
                            onClick={handlePrevious}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            disabled={nextDisable}
                            onClick={handleNext}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      )
                    }
                  </div>
                  <>

                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: (prev?.type === "product horizontal" || prev?.type === 'product vertical') ? 1 : 2,
                        fill: "row",
                      }}
                      pagination={false}
                      spaceBetween={20}
                      modules={[Grid]}
                      className="productSwiper"
                      onSwiper={setSwiperRef}
                      onBeforeInit={() => setPrevDisable(true)}
                      onReachBeginning={() => setPrevDisable(true)}
                      onReachEnd={() => setNextDisable(true)}
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                          grid: {
                            rows: (prev?.type === "product horizontal" || prev?.type === 'product vertical') ? 1 : 2,
                          },
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 3,
                          grid: {
                            rows: (prev?.type === "product horizontal" || prev?.type === 'product vertical') ? 1 : 2,
                          },
                          spaceBetween: 20,
                        },
                        1050: {
                          slidesPerView: 5,
                          grid: {
                            rows: (prev?.type === "product horizontal" || prev?.type === 'product vertical') ? 1 : 2,
                          },
                          spaceBetween: 20,
                        }
                      }}
                    >
                      {updatedData?.map((product, index) => (
                        <SwiperSlide key={`app-categories-${index}`}>
                          <Card
                            product={product}
                            key={index}
                            cartItem={cart?.cartProducts?.find((item) => item?.product?.id === product?.id)}
                            setProductModalId={setProductModalId}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                  {
                    productModalId !== '' &&
                    <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
                  }
                </section>
              </div>

            )
        )
      }
    </>
  );
};

export default AppCategories;
