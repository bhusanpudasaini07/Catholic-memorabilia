import Link from 'next/link';
import React from 'react'

interface IProps {
  imageUrl: string;
  name: string;
  shopLink: string;
}
const ProductCircleCard: React.FC<IProps> = ({ imageUrl, name, shopLink }) => {
  return (
    <Link href={shopLink}>
      <div className="flex flex-col items-center group">
        <div
          className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 mb-2"
        >
          <img
            src={imageUrl || "/images/no-image.png"}
            alt={name || "Product"}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="text-center text-sm font-medium truncate max-w-[96px] block" title={name}>
          {name?.length > 16 ? name.slice(0, 16) + '...' : name || "Product Name"}
        </span>
      </div>
    </Link>
  )
}

export default ProductCircleCard