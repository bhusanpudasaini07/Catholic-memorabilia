

import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import React, { useCallback, useState } from 'react'
import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from '@/shared/components/card';
import ProductDetailModal from '@/shared/components/product-detail-modal';

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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {products && products.length > 0 && products.slice(0, 6).map((item: any, index: number) => (
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




