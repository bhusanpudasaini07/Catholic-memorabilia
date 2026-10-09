import CollectionCard from '@/features/Product/collection-card'
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {
                    products?.length > 0 && products.slice(0, 4).map((category: any) => (
                        <CollectionCard
                            key={category.id}
                            id={category?.id}
                            image={category?.categoryImageUrl}
                            name={category?.categoryName}
                        />
                    ))
                }
          
            </div>
        </section>
    )
}

export default ShopByCollection