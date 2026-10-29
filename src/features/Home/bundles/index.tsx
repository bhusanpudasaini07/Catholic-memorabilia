import { getAllBundles } from '@/services/home.service'
import { addToCart } from '@/services/cart.service'
import ButtonLoader from '@/shared/components/btn-loading'
import Title from '@/shared/components/title'
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const Bundles = () => {
    const queryClient = useQueryClient()
    const { data: bundlesData } = useQuery({
        queryKey: ['bundles'],
        queryFn: () => getAllBundles(),
    })

    const addToCartMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Bundle added to cart')
            queryClient.invalidateQueries(['cartList'])
        },
        onError: (error: any) => {
            showToast(TOAST_TYPES.error, error?.response?.data?.message || error?.message || 'Unable to add bundle to cart.')
        },
    })

    const handleAddToCart = (bundle: any) => {
        addToCartMutation.mutate({
            bundleId: bundle.id,
            quantity: 1,
            bundle: {
                name: bundle.name,
                imageUrl: bundle.imageUrl,
                fixedPrice: bundle.fixedPrice,
            },
        })
    }

    return (
        <section id="bundles" className="mb-[60px] relative scroll-mt-48">
            <Title
                type="title-section"
                text="Gift Bundles"
                subTitle="Bundle of products"
            />
            <div className="grid grid-cols-12 gap-4">
                {(bundlesData ?? []).map((bundle: any) => (
                    <div key={bundle.id} className="col-span-12 md:col-span-6">
                        <div className="flex h-full flex-col items-stretch gap-4 rounded-lg bg-[#f9f7f3] p-3 md:flex-row">
                            <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg md:h-auto md:w-[42%] md:self-stretch">
                                <img
                                    src={bundle?.imageUrl}
                                    alt={bundle?.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-3 md:py-3 md:pr-2">
                                <h3 className="mb-2 text-lg font-semibold text-gray-850 md:text-xl">
                                    {bundle?.name}
                                </h3>
                                <p className="mb-4 max-w-xl text-sm text-gray-700 md:text-base">
                                    {bundle?.description}
                                </p>
                                <p className="mb-4 text-base font-bold text-gray-900 md:text-lg">
                                    AUD {Number(bundle?.fixedPrice || 0).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => handleAddToCart(bundle)}
                                    disabled={addToCartMutation.isLoading}
                                    className="mt-auto flex items-center justify-center gap-2 rounded-md btn btn-primary px-8 py-3 text-base font-semibold text-white transition hover:bg-[#7a3333] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Add to Cart
                                    {addToCartMutation.isLoading && addToCartMutation.variables?.bundleId === bundle.id && (
                                        <ButtonLoader className="!block" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Bundles
