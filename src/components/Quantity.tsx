import React from 'react'

interface QuantityProps {
    quantity: number;
    stock: number;
    updateCartCall: (quantity: number) => void;
}

       
const Quantity = ({ quantity, stock, updateCartCall }: QuantityProps) => {
  return (
    <div className="flex justify-center m-auto h-[40px] max-w-[115px]">
                    <button
                        className="text-base text-gray-650 p-[5px] border border-gray-350 transition-all delay-100 duration-150 hover:bg-slate-850 hover:text-primary disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:pointer-events-none"
                        onClick={() => { updateCartCall(quantity - 1) }}
                        disabled={quantity === 1 ? true : false}
                    >
                        -
                    </button>
                    <input
                        type="text"
                        className="w-full text-base text-center border-y border-y-gray-350 focus:outline-0"
                        readOnly
                        value={quantity}
                        maxLength={3}
                    />
                    <button
                        className="text-base text-gray-650 p-[5px] border border-gray-350 transition-all delay-100 duration-150 hover:bg-slate-850 hover:text-primary disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:pointer-events-none"
                        onClick={() => { updateCartCall(quantity + 1) }}
                        disabled={quantity === stock ? true : false}
                    >
                        +
                    </button>
                </div>
  )
}

export default Quantity