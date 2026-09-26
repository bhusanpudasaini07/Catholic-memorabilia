

import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useState } from 'react'
import { Grid } from 'swiper';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from '@/shared/components/card';

interface IProps {
    loading: boolean;
    products: any;
}


const NewArrival: React.FC<IProps> = ({ loading, products }) => {

    const [swiperRef, setSwiperRef] = useState<SwiperClass>();
    const [nextDisable, setNextDisable] = useState<boolean>(false)
    const [prevDisable, setPrevDisable] = useState<boolean>(false)

    //handling prev and next of swiper category
    const handlePrevious = useCallback(() => {
        setNextDisable(false)
        if (swiperRef) {
            swiperRef?.slidePrev();
        }
    }, [swiperRef]);
    // const handlePrevious = () => {
    //     swiper?.slidePrev()
    // }

    const handleNext = useCallback(() => {
        setPrevDisable(false)
        if (swiperRef) {
            swiperRef?.slideNext();
        }
    }, [swiperRef]);

    // const handleNext = () => {
    //     swiper?.slideNext()
    // }

    return (
        <section className="mb-[60px] relative">
            <Title
                type="title-section"
                text="New Arrival"
                subTitle="Discover Something Meaningful and New"
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6]?.map((index: number) => (
                        <CategorySkeletonLoading
                            key={`categories-${index}`}
                        />
                    ))}
                </div>

                :
                <Swiper
                    slidesPerView={3}
                    grid={{
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
                            slidesPerView: 1,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 2,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        },
                        1050: {
                            slidesPerView: 5,
                            grid: {
                                rows: 1
                            },
                            spaceBetween: 20
                        }
                    }}
                >
                    {products?.map((item: any, index: number) => (
                        <SwiperSlide key={`categories-${index}`}>

                            <Card
                                setProductModalId={() => {
                                    return "hi"
                                }}
                                product={item}
                                key={`app-cat-products-${index}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            }

        </section>
    )
}

export default NewArrival




