import React from 'react'

interface IProps {
    className?: string
}
const SkeletonImage = ({ className }: IProps) => {
    return (
        <figure className={`mb-4 bg-[#c2c2c2] w-80 h-80 animate-pulse  ${className}`}></figure>
    )
}

export default SkeletonImage