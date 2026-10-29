

import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useState } from 'react'
import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from '@/shared/components/card';
import ProductDetailModal from '@/shared/components/product-detail-modal';
import Link from 'next/link';

interface IProps {
    loading: boolean;
    products: any;
}


const NewArrival: React.FC<IProps> = ({ loading, products }) => {

    const [productModalId, setProductModalId] = useState<string>('');
    const [swiperRef, setSwiperRef] = useState<any>();
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
            <div className="flex items-center">

                <Title
                    type="title-section"
                    text="New Arrival"
                    subTitle="Discover Something Meaningful and New"
                />
                <div className="ms-auto">
                    <Link href="/new-in" className="flex items-center gap-2">
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {products && products.length > 0 && products.slice(0, 4).map((item: any, index: number) => (
                        <Card
                            setProductModalId={setProductModalId}
                            product={item}
                            key={`app-cat-products-${index}`}
                        />
                    ))}

                </div>

            }

            {
                productModalId !== '' &&
                <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId.toString()} />
            }
        </section>
    )
}

export default NewArrival




