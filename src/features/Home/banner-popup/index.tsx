import { IPopupBanner } from '@/interface/home.interface'
import SkeletonImage from '@/shared/components/skeleton/image'
import { setCookie } from 'cookies-next'
import Image from 'next/image'
import React from 'react'
import { FaTimes } from 'react-icons/fa'

export interface IBannerPopup {
    popupData: IPopupBanner,
    setShowPopupModal: (arg: boolean) => void,
    bannerPopupLoading: boolean
}

const BannerPopup = ({ popupData, setShowPopupModal, bannerPopupLoading }: IBannerPopup) => {

    const cancelBannerModal = () => {
        setShowPopupModal(false)
        setCookie("bannerPopup", true)
    }

    return (
        <>
            <input type="checkbox" id='banner-popup' className="modal-toggle" defaultChecked />
            <div className="modal">
                <div className="w-6/12 max-w-5xl p-3 overflow-visible rounded-lg lg:w-11/12 modal-box">
                    <div className='flex items-center justify-between'>
                        <h3 className="text-lg font-bold"></h3>
                        <button className='absolute right-[-15px] w-8 h-8 flex items-center justify-center top-[-13px] z-10 rounded-full bg-white' onClick={cancelBannerModal}><FaTimes /></button>
                    </div>
                    {
                        bannerPopupLoading ? (
                            <SkeletonImage className='w-full !mb-0' />
                        ) : (
                            popupData?.webpWebImage ? (
                                <Image
                                    width={2000}
                                    height={2000}
                                    quality={100}
                                    className='w-full h-auto'
                                    src={popupData?.webpWebImage}
                                    alt='Popup data' />

                            )
                                : (
                                    <Image width={100} height={100} quality={100} src={popupData?.appImage} alt='BannerPoppup' />
                                )

                        )
                    }
                </div>
                <label onClick={cancelBannerModal} className="modal-backdrop" htmlFor='banner-popup'>Cancel</label>
            </div>
        </>
    )
}

export default BannerPopup