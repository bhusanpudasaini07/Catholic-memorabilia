import Title from '@/shared/components/title'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

interface IProps {
    products: any
    loading: boolean
}
const ShopByCollection: React.FC<IProps> = ({ products, loading }) => {
    return (
        <section aria-label="Shop By Collection" className="mb-10">
            <div className="flex items-center justify-between">
                <Title
                    type="title-section"
                    text="Shop By Collection"
                />
                <Link href="/categories" className="flex items-center gap-2">
                    <p className="text-primary font-semibold text-[14px] hover:text-primary/80 transition-all duration-300">View All</p>
                    <FaArrowRight className="text-primary transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
            {/* Custom grid for landing: large featured left, 2x2 small on the right */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    // Show loading skeletons or similar UI if needed
                    Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className={
                                "animate-pulse bg-slate-150 rounded-lg w-full " +
                                (idx === 0
                                    ? "col-span-2 row-span-2 min-h-[210px] md:min-h-[340px] md:min-w-[320px] h-[250px] md:h-[340px]"
                                    : "min-h-[210px] h-[210px]")
                            }
                        />
                    ))
                ) : (
                    <>
                        {/* Large first collection left */}
                        {products && products.length > 0 && (
                            <Link
                                href={`/categories/${products[0]?.id}`}
                                key={products[0]?.id || 0}
                                className={
                                    "relative rounded-lg overflow-hidden group hover:shadow-md transition-shadow duration-300 w-full flex flex-col col-span-2 row-span-2 min-h-[210px] md:min-h-[340px] md:min-w-[320px] h-[250px] md:h-[340px]"
                                }
                                style={{
                                    gridColumn: "span 2 / span 2",
                                    gridRow: "span 2 / span 2",
                                }}
                            >
                                {/* Image */}
                                {products[0]?.categoryImageUrl ? (
                                    <img
                                        src={products[0].categoryImageUrl}
                                        alt={products[0]?.categoryName || products[0]?.name}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            minHeight: 250,
                                            maxHeight: 340,
                                        }}
                                    />
                                ) : (
                                    <div className="bg-slate-200 w-full h-full flex-1" />
                                )}
                                {/* Overlay */}
                                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                                {/* Text & Button */}
                                <div className="absolute left-0 bottom-0 w-full px-6 py-4 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-xl md:text-2xl mb-1 drop-shadow-lg">
                                        {products[0]?.categoryName || products[0]?.name}
                                    </h3>
                                    <p className="text-white font-medium text-sm md:text-base mb-2 opacity-80">
                                        {"Explore collection"}
                                    </p>
                                    <div className="flex items-center mt-auto">
                                        <div
                                            className="ml-auto p-2 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer flex items-center justify-center w-9 h-9"
                                            tabIndex={-1}
                                        >
                                            <FaArrowRight className="text-primary text-lg" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                        {/* Next four as small-right tiles */}
                        {products?.slice(1, 5).map((category: any, idx: number) => (
                            <Link
                                href={`/categories/${category?.id}`}
                                key={category?.id || idx + 1}
                                className={
                                    "relative rounded-lg overflow-hidden group hover:shadow-md transition-shadow duration-300 w-full flex flex-col min-h-[120px] h-[110px] md:min-h-[150px] md:h-[150px]"
                                }
                                style={{
                                    minHeight: 110,
                                    maxHeight: 180,
                                }}
                            >
                                {/* Image */}
                                {category?.categoryImageUrl ? (
                                    <img
                                        src={category.categoryImageUrl}
                                        alt={category?.categoryName || category?.name}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        style={{
                                            minHeight: 110,
                                            maxHeight: 180,
                                        }}
                                    />
                                ) : (
                                    <div className="bg-slate-200 w-full h-full flex-1" />
                                )}

                                {/* Overlay */}
                                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

                                {/* Text & Button */}
                                <div className="absolute left-0 bottom-0 w-full px-5 py-3 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-base md:text-lg mb-0 drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
                                        {category?.categoryName}
                                    </h3>
                                    <p className="text-white font-medium text-xs md:text-sm opacity-80 -mt-1 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {"Explore collection"}
                                    </p>
                                    <div className="flex items-center mt-auto">
                                        <div
                                            className="ml-auto p-1 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer flex items-center justify-center w-7 h-7"
                                            tabIndex={-1}
                                        >
                                            <FaArrowRight className="text-primary text-base" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default ShopByCollection