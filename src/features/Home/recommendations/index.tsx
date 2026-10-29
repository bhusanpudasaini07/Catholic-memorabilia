import React from 'react'
import { useProductsHooks } from '@/hooks/products.hooks';
import ProductCircleCard from '../featured-products/product-circle-card';
import Title from '@/shared/components/title';
import Loader from '@/components/Loading';
import SkeletonLoadingCard from '@/shared/components/skeleton/products';

interface IRecommendations {
    recommendations: any,
    recommendationsLoading: boolean
}
const RecommendationsProducts: React.FC<IRecommendations> = ({ recommendations, recommendationsLoading }) => {
    return (
        <section aria-label="Shop By Collection" className="mb-10">
            <div className="flex items-center justify-between">
                <Title
                    type="title-section"
                    text="Latest Browse"
                />

            </div>
            {/* Custom grid for landing: large featured left, 2x2 small on the right */}
            <div >
                {
                    recommendationsLoading ? (
                        <div className="flex items-center justify-center">
                            <SkeletonLoadingCard />
                        </div>
                    ) : (
                        <div className="flex items-center gap-10">
                        {recommendations?.map((item: any) => (
                                <ProductCircleCard
                                    key={item.id}
                                    imageUrl={item.productImageUrl}
                                    name={item.category.categoryName}
                                    shopLink={`/products?categoryId=${item.category.id}`} />
                        ))}
                            </div>
                    )
                }
            </div>
        </section>
    )
}

export default RecommendationsProducts;