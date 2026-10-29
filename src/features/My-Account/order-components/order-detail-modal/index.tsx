import Loader from '@/components/Loading'
import { IOrderDetails, IOrderItem } from '@/interface/order.interface'
import React from 'react'

export interface IOrderDetailModal {
    orderDetails: IOrderDetails | undefined,
    changeDateFormat: any,
    setShowModal: (arg0: boolean) => void,
    showModal: boolean,
    loading: boolean
}

const SHIPPING_LABELS: Record<string, string> = {
    standard: 'Standard shipping',
    express: 'Express shipping',
}

const formatMoney = (value: unknown) => {
    const amount = Number(value)
    if (Number.isNaN(amount)) return 'AUD 0.00'
    return `AUD ${amount.toFixed(2)}`
}

const formatStatus = (status?: string) => {
    if (!status) return '-'
    return status
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const getCustomerName = (order?: IOrderDetails) => {
    const userName = [order?.user?.firstName, order?.user?.lastName].filter(Boolean).join(' ')
    return userName || order?.guestName || '-'
}

const OrderDetailModal = ({
    orderDetails,
    changeDateFormat,
    setShowModal,
    showModal,
    loading
}: IOrderDetailModal) => {
    const items = orderDetails?.items ?? []
    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.originalPrice || 0) * Number(item.quantity || 0),
        0,
    )
    const discount = items.reduce(
        (sum, item) => sum + Number(item.discountAmount || 0) * Number(item.quantity || 0),
        0,
    )
    const shippingFee = Number(orderDetails?.shippingFee || 0)
    const total = Number(orderDetails?.totalAmount || 0) + shippingFee
    const shippingLabel = SHIPPING_LABELS[String(orderDetails?.shippingMethod || '').toLowerCase()] || orderDetails?.shippingMethod || '-'

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
                                                            {orderDetails?.id}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Order Date:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {orderDetails && changeDateFormat(orderDetails?.createdAt)}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Order Status:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {formatStatus(orderDetails?.orderStatus)}
                                                        </span>
                                                    </li>
                                                    <li className='flex items-center'>
                                                        <strong className="data-title">
                                                            Shipping Method:
                                                        </strong>
                                                        <span className="data-desc">
                                                            {shippingLabel}
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
                                                        <span className='data-desc'>{getCustomerName(orderDetails)}</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <strong className="data-title">
                                                            Email :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.guestEmail || orderDetails?.user?.email || '-'}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <strong className="data-title">
                                                            Phone Number :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.guestPhone || orderDetails?.user?.contactNumber || '-'}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <strong className="data-title whitespace-nowrap">
                                                            Delivery :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.deliveryAddress || '-'}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <strong className="data-title whitespace-nowrap">
                                                            Shipping :
                                                        </strong>
                                                        <span className='data-desc'>
                                                            {orderDetails?.shippingAddress || '-'}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-span-12">
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra">
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
                                                        {items.map((product: IOrderItem) => (
                                                            <tr key={product.id}>
                                                                <td className="text-sm leading-4 text-light-black">
                                                                    {product?.bundle?.name || product?.product?.productName || 'Product'} X {product?.quantity}
                                                                </td>
                                                                <td className="whitespace-nowrap">
                                                                    {formatMoney(product?.unitPrice)}
                                                                </td>
                                                                <td className="text-right whitespace-nowrap">
                                                                    {formatMoney(product?.totalPrice)}
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
                                                                Subtotal:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                {formatMoney(subtotal)}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Discount:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                {formatMoney(discount)}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="data-title">
                                                                Shipping:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                {formatMoney(shippingFee)}
                                                            </span>
                                                        </li>
                                                        <li className="flex justify-between pb-[6px] mb-[6px] border-solid border-b-[1px] border-orange-550">
                                                            <strong className="!font-bold !text-gray-50 data-title">
                                                                Total Amount:
                                                            </strong>
                                                            <span className="data-desc-2">
                                                                {formatMoney(total)}
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
