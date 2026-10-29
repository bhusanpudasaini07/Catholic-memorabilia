

import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useState } from 'react'
import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from '@/shared/components/card';
import Button from '@/shared/components/button';
import Link from 'next/link';

interface IProps {
    title: string;
    subtitle: string;
    loading: boolean;
    products: any;
}


const ProductsWithSwiper: React.FC<IProps> = ({ title, subtitle, loading, products }) => {

    const [swiperRef, setSwiperRef] = useState<any>();
    const [nextDisable, setNextDisable] = useState<boolean>(false)
    const [prevDisable, setPrevDisable] = useState<boolean>(false)

   


    return (
        <section className="mb-[60px] relative">
            <div className="flex items-center">
                <Title
                    type="title-section"
                    text={title}
                    subTitle={subtitle}
                />
                <div className="ms-auto">

                    <Link href="/products" className="flex items-center gap-2">
                        <p className="text-primary font-semibold text-[14px] hover:text-primary/80 transition-all duration-300">View All</p>
                        <FaArrowRight className="text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

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
                    {products && products?.length > 0 && products?.map((item: any, index: number) => (
                        <SwiperSlide key={`products-${index}`}>

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

export default ProductsWithSwiper




