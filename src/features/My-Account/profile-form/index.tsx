import { IProfile } from '@/interface/profile.interface'
import { getProfile, updateProfile } from '@/services/profile.service'
import SkeletonInput from '@/shared/components/skeleton/input'
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils'
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const ProfileForm = () => {
    const queryClient = useQueryClient();
    const token = getToken()
    const { data: profile, initialLoading: profileLoading }: any = useQuery({
        queryKey: ['getProfile', token]
    })
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm<IProfile>({
        defaultValues: {
            first_name: profile && profile?.data?.firstName,
            last_name: profile && profile?.data?.lastName,
            mobile_number: profile && profile?.data?.mobileNumber,
        }
    })

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'User Updated Successfully.');
            queryClient.invalidateQueries(['getProfile'])
        },
        onError: (error: any) => {
            const errors = error?.response?.data?.errors
            errors.map((err: any) => {
                showToast(TOAST_TYPES.error, err.message);
            })
        }
    })
    const profileSubmit: SubmitHandler<IProfile> = (data) => {
        mutation.mutate(data)
    }

    useEffect(() => {
        profile && reset({
            first_name: profile?.data?.firstName,
            last_name: profile?.data?.lastName,
            mobile_number: profile?.data?.mobileNumber,
        })
    }, [profile])

    return (
        <form onSubmit={handleSubmit(profileSubmit)} autoComplete='off' className="px-6 py-6">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="firstname">
                        First Name
                    </label>
                    {
                        profileLoading ? (
                            <SkeletonInput />
                        ) :
                            (
                                <>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        {...register('first_name', { required: 'FirstName is required' })}
                                        onBlur={() => trigger('first_name')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.first_name ? 'border-error' : 'border-gray-350'} `}
                                    />
                                    {
                                        errors.first_name &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.first_name.message}</p>
                                    }
                                </>
                            )
                    }

                </div>
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="firstname">
                        Last Name
                    </label>
                    {
                        profileLoading ? (
                            <SkeletonInput />
                        ) :
                            (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        {...register("last_name", { required: "LastName is required" })}
                                        onBlur={() => trigger('last_name')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.last_name ? 'border-error' : 'border-gray-350'}`}
                                    />
                                    {
                                        errors.last_name &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.last_name.message}</p>
                                    }
                                </>
                            )
                    }
                </div>
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="firstname">
                        Email Address
                    </label>
                    {
                        profileLoading ? (
                            <SkeletonInput />
                        ) :
                            (
                                <>
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Email Address"
                                        defaultValue={profile?.data?.email}
                                        className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border border-gray-350 read-only:bg-gray-350 "
                                    />
                                </>
                            )
                    }
                </div>
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="firstname">
                        Phone number
                    </label>
                    {
                        profileLoading ? (
                            <SkeletonInput />
                        ) :
                            (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        {...register('mobile_number', {
                                            required: 'Phone number is required.',
                                            pattern: {
                                                value: /^[9]\d{9}$/,
                                                message: "Phone number must start with 9 and have 10 digits.",
                                            }
                                        })}
                                        onBlur={() => trigger('mobile_number')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.mobile_number ? 'border-error' : 'border-gray-350'}`}
                                    />
                                    {
                                        errors.mobile_number &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.mobile_number.message}</p>
                                    }
                                </>
                            )
                    }
                </div>
                <div className="flex justify-between col-span-12">
                    <button
                        type='submit'
                        className="submit-btn"
                        disabled={mutation.isLoading}
                    >
                        Save
                        {
                            mutation.isLoading &&
                            <span
                                className="w-5 h-5 border-4 border-white border-dotted rounded-full border-t-transparent animate-spin"></span>
                        }
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ProfileForm