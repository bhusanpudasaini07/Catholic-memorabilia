import { setAuthorizationHeader } from '@/axios/axiosInstance';
import { logout } from '@/services/auth.service';
import { getProfile } from '@/services/profile.service';
import ConfirmationModal from '@/shared/components/confirmation-modal';
import { showToast, TOAST_TYPES } from '@/shared/utils/toast-utils/toast.utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { FaChevronDown, FaUser } from 'react-icons/fa'

interface IProps {
    logIn: boolean
}
const TopHeader = ({ logIn }: IProps) => {
const router = useRouter();
    const { data: profile } = useQuery({
        queryKey: ["getProfile", logIn],
        queryFn: getProfile,
        enabled: logIn,
    });

    const [showModal, setShowModal] = useState(false);

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            deleteCookie("token");
            deleteCookie("isLoggedIn");
            deleteCookie("cart_number");
            await setAuthorizationHeader();
       
            showToast(TOAST_TYPES.success, "Logged out successfully");
            router.push('/')
            setShowModal(false);
        },
    });


    const logoutHandler = () => {
        logoutMutation.mutate();
        router.push('/');
    };


    return (
        <header>
            {/* location header */}
            <div className="z-10 bg-primary">
                <div className="container mx-auto">
                    <div className="navbar bg-primary min-h-[48px] text-[12px] flex-wrap flex-col sm:flex-row px-2">
                        <div className="flex-1 align-items-center">

                            <p className="font-semibold text-white">Welcome to Catholic Memorabilia </p>

                        </div>
                        <div className="flex-none">
                            <FaUser className="w-[13px] h-auto text-white me-2" />
                            {profile ? (
                                <div className="dropdown dropdown-hover dropdown-end">
                                    <label
                                        tabIndex={0}
                                        className="text-xs text-white py-1 m-1 px-0 capitalize bg-transparent border-0 hover:bg-transparent hover:transform hover:scale-[1.1] btn"
                                    >
                                        {profile?.firstName}
                                        <FaChevronDown className="w-[13px] h-auto text-white ms-2" />
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="w-full min-w-[160px] py-2 px-3.5 shadow dropdown-content menu bg-base-100 top-[30px] z-[100]"
                                    >
                                        <li className="mx-5">
                                            <Link
                                                href={"/account/profile"}
                                                className="text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold dropdown-item hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                                            >
                                                My Account
                                            </Link>
                                        </li>
                                        <li className="mx-5 ">
                                            <Link
                                                href={"/checkout"}
                                                className="text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center font-semibold dropdown-item hover:transform hover:scale-[1.05] hover:!px-0 focus:!bg-transparent"
                                            >
                                                Checkout
                                            </Link>
                                        </li>
                                        <li className="mx-5 ">
                                            <button
                                                onClick={() => setShowModal(!showModal)}
                                                className="!border-b-0 dropdown-item font-semibold text-xs text-gray-850 focus:bg-none focus:text-primary py-3 px-0 text-center hover:transform hover:scale-[1.05] hover:!px-0"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                    {showModal && (
                                        <ConfirmationModal
                                            confirmHeading="Are you sure you want to logout?"
                                            modalType="logout_modal"
                                            btnName="Logout"
                                            showModal={showModal}
                                            btnFunction={logoutHandler}
                                            cancelFuntion={() => setShowModal(false)}
                                            isLoading={logoutMutation.isLoading}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="flex">
                                    <Link
                                        href={"/login"}
                                        className="btn btn-link capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                                    >
                                        Login
                                    </Link>
                                    <div className="divider divider-horizontal before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0"></div>
                                    <Link
                                        href={"/register"}
                                        className="btn btn-link capitalize text-[12px] text-slate-50 no-underline h-auto min-h-fit p-0 hover:no-underline hover:transform hover:scale-[1.1]"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default TopHeader