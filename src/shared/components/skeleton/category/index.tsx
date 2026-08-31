import React from 'react'

const CategorySkeletonLoading = () => {
    return (
        <div className="card bg-base-100 border plant-card">
            <div className='flex items-center h-40'>
                <div>
                    <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-40 animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded mb-3 mx-4 w-24 animate-pulse"></div>
                </div>
                <figure className="bg-gray-300 w-full h-full animate-pulse"></figure>
            </div>
        </div>
    )
}

export default CategorySkeletonLoading