import Card from '@/shared/components/card'
import Image from 'next/image'
import router, { useRouter } from 'next/router'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

interface IProps {
    id: string
    image: string
    name: string
}
const CollectionCard: React.FC<IProps> = ({ id, image, name }) => {
    const router = useRouter()
    return (
        <section>
            <div className="card group cursor-pointer" onClick={() => router.push(`/category/${id}`)}>
                <div className="h-[290px] w-full relative  overflow-hidden border border-[#E3D9C9] bg-[#EDE5D9]">
                    <Image
                        src={image || "/images/products/rosaries.png"}
                        alt={name || 'Collection Name'}
                        loading="lazy"
                        fill
                        className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <p className="card-title font-semibold capitalize text-[16px] group-hover:text-primary">{name || 'Collection Name'}</p>
                    <FaArrowRight className="text-[#956676] transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </section>
    )
}

export default CollectionCard