import Quantity from '@/components/Quantity';
import { useCartsHooks } from '@/hooks/cart.hooks';
import { addToCart } from '@/services/cart.service';
import ButtonLoader from '@/shared/components/btn-loading';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback,    useState } from 'react'
import { FaTimes } from 'react-icons/fa';

const CartTableRow = ({ item }: any) => {
    const [quantity, setQuantity] = useState<number>(item?.quantity || 1);
    const stock: any = item?.selectedUnit?.stock

    const { updateCartMutation, handleRemoveFromCart, cartDeleteLoading } = useCartsHooks(); //customHook

    /*
  ** Provides payload to the update api when the value is being increased or decreased.
  */
    const handleUpdateCart = (newQuantity: number, itemId: number) => {
            const payload: any = {
                productId: itemId,
                quantity: newQuantity,
            }
            updateCartMutation.mutate(payload)
    };

    /**
     * Used in order to debounce the value(quantity) that is being updated.
     */
    const debouncedHandleUpdateCart = useCallback( //debounce callback to call when value changes
        debounce((newQuantity) => {
            handleUpdateCart(newQuantity, item?.productId!)
        }, 300), [item]
    )

    /**
     * For btn onClick function to pass the new value either being increased or decreased.
     */
    const updateCartCall = (newQuantity: number) => {
        setQuantity(newQuantity) //set the updated value
        debouncedHandleUpdateCart(newQuantity) //debounce callback added the updated value
    }

    // useEffect(() => {
    //     handleUpdateCart(debounceSearchValue);
    // }, [debounceSearchValue])
    const selectedUnit = item?.selectedUnit


    return (
        <>
        <tr className="border-b-gray-350">
            <td className="w-[150px] text-gray-650 text-center py-[30px] font-medium">
                <Image
                    src={ item?.product?.productImageUrl || ''}
                    height={80}
                    width={80}
                    alt={item?.product?.productName || ''}
                />
            </td>
            <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium">
                <Link href={`/products/${item?.product?.id}`} className="text-[15px] hover:text-primary" aria-label="indoor-plants" >
                    {item?.product?.productName}{" "}
                </Link>
                {
                    selectedUnit?.stock === 0 &&
                    <p className='px-2 m-auto mt-2 text-xs border border-red-250 text-red-250 w-fit'>Out Of Stock</p>
                }
            </td>
            <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium text-[15px]">
                AUD {item?.unitPrice}
            </td>
            <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium">
               
                <Quantity quantity={quantity} stock={stock} updateCartCall={updateCartCall} />
            </td>
            <td className="text-gray-650 text-center py-[30px] font-medium text-[15px]">
                AUD {item?.totalPrice}
            </td>
            <td className="w-[100px] text-center py-[30px]">
                <button
                    disabled={cartDeleteLoading}
                    className="disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-0 border border-gray-350 flex items-center justify-center m-auto transition-all delay-100 duration-150 w-[40px] h-[36px] hover:bg-slate-850 hover:text-primary"
                    onClick={() => handleRemoveFromCart(item?.id)}
                >
                    {
                        cartDeleteLoading ? (
                            <ButtonLoader className='!border-primary' />
                        ) : (
                            <FaTimes className="w-[15px]" />
                        )
                    }
                </button>
            </td>
        </tr>
        </>
    )
}

export default CartTableRow