import { addCouponCode, bulkDeleteCart, deleteCartItemById, updateCart } from "@/services/cart.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

export const useCartsHooks = () => {
    const [selectedId, setSelectedId] = useState<number>(0);
    const queryClient = useQueryClient();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any>();

   

    // Modify guestCart to allow adding multiple products to cart in localStorage
    const guestCart = (payload: any) => {
        let cartItems = [];
        const existingCart = localStorage.getItem('cart');
       
        if (existingCart) {
            try {
                cartItems = JSON.parse(existingCart)?.items;
                if (!Array.isArray(cartItems)) {
                    cartItems = [];
                }
            } catch {
                cartItems = [];
            }
        }

        // Check if product already exists in cart
        const index = cartItems.findIndex((item: any) => item.product_id === payload.product_id);
        if (index > -1) {
            // If it exists, update the cart_quantity
            cartItems[index].quantity = (cartItems[index].quantity || 1) + (payload.quantity || 1);
        } else {
            // If not, add as new
            cartItems.push({ ...payload, quantity: payload.quantity || 1 });
        }
        const localCart = {
            items: cartItems,
            totalItems: cartItems.reduce((total: number, item: any) => total + item.quantity, 0),
            totalAmount: Number(cartItems.reduce((total: number, item: any) => total + Number(item.product?.productPrice * item.quantity), 0).toFixed(2)),
            userId: 'guest',
        }
        setCartItems(localCart);
        localStorage.setItem('cart', JSON.stringify(localCart));
    }

    console.log("cartItems", cartItems)
    const cartDelete = useMutation({
        mutationFn: deleteCartItemById,
        onSuccess: () => {
            queryClient.invalidateQueries(['cartList'])
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
        mutationFn: updateCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Item Updated To Cart Successfully');
            queryClient.invalidateQueries(['cartList'])
        },
        onError: (error: any) => {
            showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.message);
        }
    })

    const bulkCartDelete = useMutation({
        mutationFn: bulkDeleteCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Item Deleted From Cart Successfully');
            deleteCookie('cart_number')
            queryClient.invalidateQueries(['cartList'])
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
        setCartItems,
        cartItems,
        guestCart,
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