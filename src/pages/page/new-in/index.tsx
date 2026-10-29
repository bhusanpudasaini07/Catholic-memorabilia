

import Card from '@/shared/components/card';
import Pagination from '@/shared/components/pagination';
import CategorySkeletonLoading from '@/shared/components/skeleton/category'
import Title from '@/shared/components/title'
import { useState } from 'react';

interface IProps {
    loading: boolean;
    products: any;
}


const NewInPage: React.FC<IProps> = ({ loading, products }) => {

   
    const [currentPage, setCurrentPage] = useState<number>(1);
    const perPage = 10;

    const handlePageChange = (value: number) => {
        setCurrentPage(value);
    }

    return (
        <section className="mb-[60px] relative">
            <Title
                type="title-section"
                text="New Arrival"
                subTitle="Discover Something Meaningful and New"
            />
          
            {loading ?
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6]?.map((index: number) => (
                        <CategorySkeletonLoading
                            key={`categories-${index}`}
                        />
                    ))}
                </div>

                :
                <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                {products && products?.length > 0 && products?.map((item: any, index: number) => (
                    <div className='col-span-3' key={`app-cat-products-${index}`}>

                        <Card
                            setProductModalId={() => { return; }}
                            product={item}
                            key={`app-cat-products-${index}`}
                        />
                        </div>
                    ))}
                    
                </div>
                </>
            }
              <Pagination
                        totalPages={products?.totalPages}
                        currentPage={currentPage}
                        pageChange={handlePageChange}
                    />

        </section>
    )
}

export default NewInPage




