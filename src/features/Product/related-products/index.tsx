import { IProduct } from '@/interface/product.interface'
import Card from '@/shared/components/card'
import ProductDetailModal from '@/shared/components/product-detail-modal'
import SkeletonLoadingCard from '@/shared/components/skeleton/products'
import Title from '@/shared/components/title'
import React, { useCallback, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Grid } from 'swiper'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'

export interface IRelatedProducts {
    relatedProducts: IProduct[],
    relatedProductsLoading: boolean
}

const RelatedProducts = ({ relatedProducts, relatedProductsLoading }: IRelatedProducts) => {
    const [productModalId, setProductModalId] = useState<string>("")

    //For swiper
    const [nextDisable, setNextDisable] = useState<boolean>(false)
    const [prevDisable, setPrevDisable] = useState<boolean>(false)
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
        <section className="my-[60px]">
            <div className="container">
                <div className='flex items-center justify-between'>
                    <Title type="title-section" text="You Might Also Like" />
                    {
                        relatedProducts?.length > 5 && (
                            <div className='!static productSwiper-navigation mb-[45px]'>
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
                </div>
                {
                    relatedProductsLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <SkeletonLoadingCard
                                    key={`app-skeleton-${index}`}
                                />
                            ))}
                        </div>
                    ) : (
                        relatedProducts && relatedProducts &&
                        <Swiper
                            slidesPerView={5}
                            grid={{
                                rows: 1,
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
                                    slidesPerView: 2,
                                    grid: {
                                        rows: 1,
                                        fill: "row"
                                    },
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    grid: {
                                        rows: 1,
                                        fill: "row"
                                    },
                                    spaceBetween: 20,
                                },
                                1050: {
                                    slidesPerView: 5,
                                    grid: {
                                        rows: 1,
                                        fill: "row"
                                    },
                                    spaceBetween: 20,
                                }
                            }}
                        >
                            {relatedProducts?.map((product: any, index: any) => (
                                <SwiperSlide key={`related-products-${index}`}>
                                    <Card
                                        setProductModalId={setProductModalId}
                                        product={product}
                                        key={`app-cat-products-${index}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )
                }
                {
                    productModalId !== '' &&
                    <ProductDetailModal setProductModalId={setProductModalId} slug={productModalId} />
                }
            </div>
        </section >
    )
}

export default RelatedProducts