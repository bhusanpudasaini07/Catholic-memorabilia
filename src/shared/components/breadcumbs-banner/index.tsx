import { BreadCrumbImage } from '@/shared/lib/image-config'
import Link from 'next/link'
import React from 'react'

const BreadcumbsBanner = () => {
  return (
    <div className=" bg-no-repeat position-relative" style={{ backgroundImage: `url(${BreadCrumbImage})`, backgroundPosition: '99%' }}>
        <div className="container">
            <div className="flex items-center space-x-2 py-8">
              <Link href="/" className="text-gray-600 hover:text-black cursor-pointer font-medium">Home</Link>
              <span className="text-gray-500">{'>'}</span>
              <span className="text-black font-bold">Cart</span>
         
            </div>
       
            
        </div>
    </div>
  )
}

export default BreadcumbsBanner