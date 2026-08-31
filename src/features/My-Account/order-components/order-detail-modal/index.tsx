import Loader from '@/components/Loading'
import { IOrderDetails, IOrderProduct } from '@/interface/order.interface'
import React from 'react'

export interface IOrderDetailModal {
    orderDetails: IOrderDetails | undefined,
    changeDateFormat: any,
    setShowModal: (arg0: boolean) => void,
    showModal: boolean,
    loading: boolean
}

const OrderDetailModal = ({
    orderDetails,
    changeDateFormat,
    setShowModal,
    showModal,
    loading
}: IOrderDetailModal) => {
    return (
        <>
            <input
                type="checkbox"
                id="mymodal"
                className="modal-toggle"
                defaultChecked
            />
            <div className="modal">
                <form
                    method="dialog"
                    className="modal-box md:min-w-[800px] rounded-lg"
                >
                    <h3 className="mb-[24px] pb-[24px] border-solid border-b-[1px] border-orange-550 text-center text-[20px]">
                        Order Detail
                    </h3>
                    <label
                        htmlFor="mymodal"
                        onClick={() => setShowModal(!showModal)}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-[26px] "
                    >
                        ✕
                    </label>
                    {/* <button onClick={() => setShowModal(false)} >
                    </button> */}
                    <div className="modal-body">
                        {
                            loading ? (
                                <Loader />
                            ) : (
                                <div className="order-detail-inner order-detail-inner-div">
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="list-detail-options has-checkbox">
                                                <ul className="flex flex-col">
                                                    <li className="flex items-center order-number">
                                                        <strong className="data-title">
                                                            Order ID :
                                                        </strong>
                                                        <span className="data-desc">
                                                            {orderDetails?.orderNumber}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Order Date:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {orderDetails && changeDateFormat(orderDetails?.orderDate)}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Payment Method:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {orderDetails?.paymentMethod?.title}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Payment Status:
                                                        </strong>
                                                        <span className="capitalize data-desc">
                                                            {orderDetails?.paymentStatus}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Order Status:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {orderDetails?.orderStatus}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div >
                                        </div >
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="sm:py-0 py-[20px] mb-2">
                                                <h3 className="text-left font-medium text-[18px] mb-2">Customer Detail</h3>
                                                <ul className="flex flex-col">
                                                    <li className="flex items-center">
                                                        <strong className="data-title">
                                                            Name :
                                                        </strong>
                                                        <span className='data-desc'>{orderDetails?.deliveryAddress?.customerName}</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <strong className="data-title">
                                                            Phone Number :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.deliveryAddress?.mobileNumber}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <strong className="data-title whitespace-nowrap">
                                                            Address :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.deliveryAddress?.address}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-span-12">
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra">
                                                    {/* head */}
                                                    <thead>
                                                        <tr>
                                                            <th className="table-header w-[355px]">
                                                                Products
                                                            </th>
                                                            <th className="table-header">
                                                                Unit Price
                                                            </th>
                                                            <th className="text-right table-header">
                                                                Total Price
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderDetails?.orderProducts?.map((product: IOrderProduct, index: number) => (
                                                            <tr key={index}>
                                                                <td className="text-sm leading-4 text-light-black">
                                                                    {product?.productTitle} X {product?.quantity}
                                                                </td>
                                                                <td className="whitespace-nowrap">
                                                                    NRS {product?.price}
                                                                </td>
                                                                <td className="text-right whitespace-nowrap">
                                                                    NRS {product?.quantity * product?.price}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-span-12">
                                            <div className="grid grid-cols-12 pt-[10px]">
                                                <div className="col-span-12 md:col-span-6">
                                                    <h3 className="pb-[6px] font-semibold text-supergray-1100-350">
                                                        Order Total
                                                    </h3>
                                                </div>
                                                <div className="col-span-12 md:col-span-6">
                                                    <ul className="flex flex-col pr-[15px] ">
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Order Amount:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                NRS {orderDetails?.orderAmount}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Discount:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                NRS {orderDetails?.discount}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Subtotal:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                NRS {orderDetails?.subTotal}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Delivery Charge:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                NRS {orderDetails?.deliveryCharge}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="!font-bold !text-gray-50 data-title">
                                                                Total Amount:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                NRS {orderDetails?.total}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            )
                        }

                    </div >
                </form >
                <label
                    className="modal-backdrop"
                    htmlFor="mymodal"
                    onClick={() => setShowModal(!showModal)}
                ></label>
            </div >
        </>
    )
}

export default OrderDetailModal