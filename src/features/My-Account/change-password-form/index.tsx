import React from 'react'
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { IChangePassword } from '@/interface/password.interface';
import { changePassword, logout } from '@/services/auth.service';
import ButtonLoader from '@/shared/components/btn-loading';

const ChangePasswordForm = () => {
    const router = useRouter();

  

    /**
     * Get Api calls
     */
    const { register, handleSubmit, watch, getValues, formState: { errors, isDirty }, trigger } = useForm<IChangePassword>();

    /**
     * Mutation function for changing password
     */
    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            logoutMutation.mutate();
        },
        onError: (error: any) => {
            const errors = error?.response?.data?.errors;
            showToast(TOAST_TYPES.error, errors[0]?.title);
        }
    });

    const changePasswordSubmit: SubmitHandler<IChangePassword> = (changePassword) => {
        mutation.mutate(changePassword)
    }
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            deleteCookie("token");
            deleteCookie("isLoggedIn");
            router.push('/login');
        },
        onError: (error: any) => {
            console.log(error);
        }
    });

    /**
     * Effects
     */
    

    return (
        <form className="px-6 py-6" onSubmit={handleSubmit(changePasswordSubmit)} autoComplete="off">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <input
                        type="password"
                        placeholder="OLD PASSWORD"
                        // className="w-full h-10 input input-bordered "
                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors?.currentPassword ? 'border-error' : 'input-bordered'}`}
                        {...register("currentPassword", { required: 'Old Password is required.' })}
                        onKeyUp={() => trigger("currentPassword")}
                    />
                    {
                        errors?.currentPassword &&
                        <p className="text-error text-xs leading-[24px] mt-1">{errors?.currentPassword?.message}</p>
                    }
                </div>
                <div className="col-span-12">
                    <input
                        type="password"
                        placeholder="NEW PASSWORD"
                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors?.newPassword ? 'border-error' : 'input-bordered'}`}
                        {...register("newPassword", {
                            required: 'Password is required',
                            minLength: {
                                value: 7,
                                message: "Password must have at least 8 characters.",
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
                            },
                        })}
                        onKeyUp={() => trigger("newPassword")}
                    />
                    {
                        errors?.newPassword &&
                        <p className="text-error text-xs leading-[24px] mt-1">{errors?.newPassword?.message}</p>
                    }
                </div>
                
                <div className="flex justify-between col-span-12">
                    <button
                        className="btn btn-tertiary text-slate-850 text-sm font-bold uppercase px-[30px] py-[11px] rounded-[30px] hover:bg-primary hover:text-white hover:border-primary"
                    >
                        Save
                        {
                            mutation.isLoading &&
                            <ButtonLoader />
                        }
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ChangePasswordForm