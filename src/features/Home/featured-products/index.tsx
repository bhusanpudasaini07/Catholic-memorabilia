import CategoryCard from '@/shared/components/category-card'
import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useMemo, useState } from 'react'
import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCircleCard from './product-circle-card';

interface IProps {
    loading: boolean;
    products: any;
}


const FeaturedProducts: React.FC<IProps> = ({ loading, products }) => {

    const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
    const [nextDisable, setNextDisable] = useState<boolean>(false)
    const [prevDisable, setPrevDisable] = useState<boolean>(false)

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
        <section className="mb-[60px] relative">
            <Title
                type="title-section"
                text="Shop By Collection"
            />
            {
                products?.length > 6 && (
                    <div className='productSwiper-navigation'>
                        <button
                            disabled={prevDisable}
                            onClick={handlePrevious}>
                            <FaChevronLeft />
                        </button>
                        <button
                            disabled={nextDisable}
                            onClick={handleNext}>
                            <FaChevronRight />
                        </button>
                    </div>
                )
            }
            {loading ?
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6]?.map((index: number) => (
                        <CategorySkeletonLoading
                            key={`categories-${index}`}
                        />
                    ))}
                </div>

                :
                <Swiper
                    slidesPerView={8}
                    grid={{
                        rows: 1,
                        fill: "row",
                    }}
                    pagination={false}
                    modules={[Grid]}
                    className="productSwiper"
                    onSwiper={setSwiperRef}
                    onBeforeInit={() => setPrevDisable(true)}
                    onReachBeginning={() => setPrevDisable(true)}
                    onReachEnd={() => setNextDisable(true)}
                    breakpoints={{
                        0: {
                            slidesPerView: 3,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 6,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        },
                        1050: {
                            slidesPerView: 8,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        }
                    }}
                >
                    {products && products.length > 0 && products
                        .filter((item: any) => item?.isFeatured)
                        .map((item: any, index: number) => (
                            <SwiperSlide key={`categories-${index}`}>
                                <ProductCircleCard
                                    key={`categories-${index}`}
                                    imageUrl={item?.productImageUrl}
                                    name={item?.productName}
                                    shopLink={`/products/${item?.id}`}
                                />
                            </SwiperSlide>
                        ))
                    }
              
                </Swiper>
            }

        </section>
    )
}

export default FeaturedProducts