import { CartEmpty } from '@/shared/lib/image-config'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const EmptyOrder = () => {
    return (
        <div className="container">
            <div className="max-w-[520px] mx-auto text-center py-12">
                <div className="">
                    <Image
                        className="object-contain mx-auto w-[150px] h-auto"
                        src={CartEmpty}
                        width={100}
                        height={100}
                        alt="empty-cart"
                    />
                </div>
                <h1 className="mb-4 text-xl font-medium lg:mb-3">
                    Your Order history is currently empty
                </h1>
                <p className="mb-4 text-md ">
                    Thank you for using I am the Gardener. It looks like you haven&apos;t
                    ordered any item.
                </p>
                <Link
                    href='/'
                    className="inline-block px-6 py-3 text-white btn-primary rounded-3xl"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}

export default EmptyOrder