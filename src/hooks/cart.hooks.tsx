import { bulkDeleteCart, deleteCartItemById, getCartProduct, updateCart } from "@/services/cart.service";
import { readGuestCart } from "@/services/guest-cart";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

let cartRemovalLocked = false;

const cartFromMutation = (data: any) => {
    if (Array.isArray(data?.items)) return data;
    if (Array.isArray(data?.data?.items)) return data.data;
    return null;
};

export const useCartsHooks = () => {
    const [selectedId, setSelectedId] = useState<number>(0);
    const [removalLocked, setRemovalLocked] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: cartList } = useQuery<any>({
        queryKey: ['cartList'],
        queryFn: getCartProduct,
        refetchOnMount: 'always',
        initialData: () => {
            if (typeof window === 'undefined' || getCookie('isLoggedIn')) return undefined;
            return readGuestCart();
        },
      });
    const releaseRemovalLock = () => {
        window.setTimeout(() => {
            cartRemovalLocked = false;
            setRemovalLocked(false);
        }, 400);
    };
    const cartDelete = useMutation({
        mutationFn: (input: number | { productId?: number; bundleId?: number }) =>
            typeof input === 'number'
                ? deleteCartItemById(input)
                : deleteCartItemById(input.productId ?? 0, input.bundleId),
        onSuccess: (data) => {
            const cart = cartFromMutation(data);
            if (cart) queryClient.setQueryData(['cartList'], cart);
            else queryClient.invalidateQueries(['cartList']);
            if (router.pathname === '/wishlist') {
                queryClient.invalidateQueries(['wishlistProducts'])
            }
        },
        onSettled: () => {
            releaseRemovalLock();
        },
    })

    const handleRemoveFromCart = (id?: number, bundleId?: number) => {
        if (cartRemovalLocked) return;
        const productId = Number(id);
        const bundle = bundleId === undefined || bundleId === null ? undefined : Number(bundleId);
        const removingBundle = Number.isInteger(bundle) && (bundle as number) > 0;
        if (!removingBundle && (!Number.isInteger(productId) || productId < 1)) return;
        cartRemovalLocked = true;
        setRemovalLocked(true);
        setSelectedId(removingBundle ? (bundle as number) : productId);
        cartDelete.mutate(removingBundle ? { productId, bundleId: bundle } : productId);
    };

    const updateCartMutation = useMutation({
        mutationFn: updateCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Item Updated To Cart Successfully');
            queryClient.invalidateQueries(['cartList'])
        },
        onError: (error: any) => {
            showToast(TOAST_TYPES.error, error?.response?.data?.errors?.[0]?.message || error?.message || "Unable to update cart.");
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



    return {
        cartList,
        handleRemoveFromCart,
        cartDelete,
        selectedId,
        updateCartMutation,
        bulkCartDelete,
        bulkDeleteLoading: bulkCartDelete.isLoading,
        updateCartLoading: updateCartMutation.isLoading,
        removalLocked,
        cartDeleteLoading: cartDelete.isLoading || removalLocked,
    };
};