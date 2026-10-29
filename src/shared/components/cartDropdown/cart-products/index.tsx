import Link from 'next/link'
import React from 'react'
import Badge from '../../badge'
import Image from 'next/image'
import { FaTimes } from 'react-icons/fa'

const CartDropdownProducts = ({ item, onRemove, removing, pending }: any) => {
    //for checking sku units
    const selectedUnit = item?.selectedUnit;

    const quantity = Number(item?.quantity) || 0;
    const unitOriginal = Number(item?.originalPrice ?? item?.product?.originalPrice ?? item?.product?.productPrice ?? item?.unitPrice);
    const parsedSale = Number(item?.product?.priceAfterDiscount ?? item?.priceAfterDiscount);
    const unitSale = Number.isFinite(parsedSale) ? parsedSale : unitOriginal;
    const onSale = Boolean(item?.product?.hasDiscount || item?.product?.hasOffer) && Number.isFinite(unitOriginal) && unitSale < unitOriginal;
    const payableUnit = onSale ? unitSale : unitOriginal;
    const lineTotal = Number.isFinite(payableUnit) ? payableUnit * quantity : Number(item?.totalPrice) || 0;

    return (
        <div key={item?.productId} className="relative flex gap-4 py-3 border-b border-gray-350">
            <div className="min-w-[85px] min-h-[100px] aspect-auto border border-gray-350 relative">
                {!item?.bundleId && <Link href={`/products/${item?.productId}`} className="absolute w-full h-full" aria-label={`product-item-slug`} />}
                {/* <img src={item?.productImageUrl} alt="image" className="object-contain min-w-[93px] max-w-[93px] min-h-[92px]" /> */}
                <Image
                    width={85}
                    height={100}
                    style={{
                        width: 'auto',
                        height: 'auto'
                    }}
                    src={item?.product?.productImageUrl}
                    alt="image"
                    className="object-contain min-w-[93px] max-w-[93px] min-h-[92px]"
                    crossOrigin="anonymous"
                />
                <Badge className="badge-primary left-1 top-1" badgePosition="top-left">
                    <span className="text-xs">{item.quantity}x</span>
                </Badge>
            </div>
            <div className="flex-grow">
                {item?.bundleId ? (
                    <span className="overflow-hidden capitalize text-sm font-semibold block text-ellipsis whitespace-nowrap max-w-[80%]">
                        {item?.product?.productName}
                    </span>
                ) : (
                <Link
                    href={`/products/${item?.productId}`}
                    aria-label={`product-${item?.sId}`}
                    className="overflow-hidden capitalize text-sm font-semibold transition-all delay-150 duration-150 block text-ellipsis whitespace-nowrap max-w-[80%] hover:text-primary ">
                    {item?.product?.productName}
                </Link>
                )}
                <p className="mt-1 text-sm text-primary font-bold">
                    <span className="pr-1">AUD</span>
                    {lineTotal}
                   {onSale && <span className=" text-gray-450 line-through pl-4">
                        {unitOriginal * quantity}
                    </span>}
                </p>
                
                {
                    selectedUnit?.stock === 0 &&
                    <p className='mt-1 text-xs text-red-250'>Out Of Stock</p>
                }
            </div>
            <button
                type="button"
                className="absolute right-0 z-10 w-5 btn-circle btn-error btn aspect-square hover:bg-primary hover:border-primary bg-gray-750 border-gray-750"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove();
                }}
                disabled={removing}>
                {pending && removing ? (
                    <span className="w-3 h-3 border-2 border-dotted rounded-full border-primary border-t-transparent animate-spin"></span>
                ) : (
                    <FaTimes className="w-3 h-3 text-white" />
                )}
            </button>
        </div>
    )
}

export default CartDropdownProducts