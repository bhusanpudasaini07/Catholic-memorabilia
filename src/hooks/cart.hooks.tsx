import { addCouponCode, bulkDeleteCart, deleteCartItemById } from "@/services/cart.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

export const useCartsHooks = () => {
    const [selectedId, setSelectedId] = useState<number>(0);
    const queryClient = useQueryClient();
    const router = useRouter()

    const cartDelete = useMutation({
        mutationFn: deleteCartItemById,
        onSuccess: () => {
            queryClient.invalidateQueries(['getCartList'])
            queryClient.invalidateQueries(['getCart'])
            showToast(TOAST_TYPES.success, 'Item Deleted From Cart Successfully');
            if (router.pathname === '/wishlist') {
                queryClient.invalidateQueries(['wishlistProducts'])
            }
        }
    })

    const handleRemoveFromCart = (id: number) => {
        setSelectedId(id)
        cartDelete.mutate(id)
    };

    const updateCartMutation = useMutation({
        // mutationFn: updateCart,
        // onSuccess: () => {
        //     showToast(TOAST_TYPES.success, 'Item Updated To Cart Successfully');
        //     queryClient.invalidateQueries(['getCart'])
        // },
        // onError: (error: any) => {
        //     showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message);
        // }
    })

    const bulkCartDelete = useMutation({
        mutationFn: bulkDeleteCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Item Deleted From Cart Successfully');
            deleteCookie('cart_number')
            queryClient.invalidateQueries(['getCart'])
        }
    })

    // const addCoupon = useMutation({
    //     mutationFn: addCouponCode,
    //     onSuccess: (data) => {
    //         queryClient.invalidateQueries(['getCart'])
    //     },
    //     onError: (error: any) => {
    //         showToast(TOAST_TYPES.error, error[0]?.title)
    //         if (localStorage.getItem('coupon')) {
    //             localStorage.removeItem('coupon')
    //         }
    //     }
    // })


    return {
        handleRemoveFromCart,
        cartDelete,
        selectedId,
        updateCartMutation,
        bulkCartDelete,
        bulkDeleteLoading: bulkCartDelete.isLoading,
        updateCartLoading: updateCartMutation.isLoading,
        cartDeleteLoading: cartDelete.isLoading,
    };
};