import CategoryCard from '@/shared/components/category-card'
import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useMemo, useState } from 'react'
import { Grid, Navigation } from 'swiper';
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface IProps {
    loading: boolean;
    categories: any;
}
const Categories: React.FC<IProps> = ({ loading, categories }) => {
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
        <section className="my-[60px] relative">
            <Title
                type="title-section"
                text="Shop By Categories"
                subTitle="We’ve got something for everyone"
            />
            {
                categories?.length > 6 && (
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
                    slidesPerView={3}
                    grid={{
                        rows: 2,
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
                                rows: 2
                            },
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 2,
                            grid: {
                                rows: 2
                            },
                            spaceBetween: 20
                        },
                        1050: {
                            slidesPerView: 3,
                            grid: {
                                rows: 2
                            },
                            spaceBetween: 20
                        }
                    }}
                >
                    {categories?.map((item: any, index: number) => (
                        <SwiperSlide key={`categories-${index}`}>

                            <CategoryCard
                                key={`categories-${index}`}
                                title={item?.name}
                                totalProducts={item?.productCount}
                                shopLink={`/categories/${item?.slug}`}
                                image={item?.webpBackgroundImage ? item?.webpBackgroundImage : item?.backgroundImage}
                            />

                        </SwiperSlide>
                    ))}
                </Swiper>
            }

        </section>
    )
}

export default Categories