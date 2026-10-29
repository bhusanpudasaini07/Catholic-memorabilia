import Title from '@/shared/components/title'
import React from 'react'

const bundles = [
    {
        src: '/images/bundles/1.jpeg',
        alt: 'The Graceful Beginning Bundle',
        name: 'The Graceful Beginning Bundle',
        price: 'A$89.00',
        description: 'A beautiful set for new beginnings, featuring our Pearl Rosary, a prayer card and keepsake box.',
    },

    {
        src: '/images/bundles/2.jpeg',
        alt: 'The Spiritual Journey Bundle',
        name: 'The Spiritual Journey Bundle',
        price: 'A$90.00',
        description: 'A beautiful set for spiritual journey, featuring our Pearl Rosary, a prayer card and keepsake box.',
    },
]

const Bundles = () => {
    return (
        <section id="bundles" className="mb-[60px] relative scroll-mt-48">
            <Title
                type="title-section"
                text="Gift Bundles"
                subTitle="Bundle of products"
            />
            <div className="grid grid-cols-12 gap-4">
                {bundles.map((bundle) => (
                    <div key={bundle.src} className="col-span-12 md:col-span-6">
                        <div className="flex h-full flex-col items-stretch gap-4 rounded-lg bg-[#f9f7f3] p-3 md:flex-row">
                            <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg md:h-auto md:w-[42%] md:self-stretch">
                                <img
                                    src={bundle.src}
                                    alt={bundle.alt}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-3 md:py-3 md:pr-2">
                                <h3 className="mb-2 text-lg font-semibold text-gray-850 md:text-xl">
                                    {bundle.name}
                                </h3>
                                <p className="mb-4 max-w-xl text-sm text-gray-700 md:text-base">
                                    {bundle.description}
                                </p>
                                <p className="mb-4 text-base font-bold text-gray-900 md:text-lg">
                                    {bundle.price}
                                </p>
                                <button
                                    className="mt-auto rounded-md btn btn-primary px-8 py-3 text-base font-semibold text-white transition hover:bg-[#7a3333] focus:outline-none"
                                >
                                    Add to Cart
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
