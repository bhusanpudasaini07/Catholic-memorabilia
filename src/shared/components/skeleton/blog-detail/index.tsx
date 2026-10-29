import React from 'react'

const SkeletonBlogDetail = () => {
  return (
    <div className="bg-base-100 w-full">
            <figure className="mb-4 bg-gray-300 h-80 animate-pulse"></figure>
            <div className="w-40 h-5 mx-4 mb-3 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-80 h-5 mx-4 mb-3 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-60 h-5 mx-4 mb-3 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-5 mx-4 mb-3 bg-gray-300 rounded animate-pulse"></div>
    </div>
  )
}

export default SkeletonBlogDetail
