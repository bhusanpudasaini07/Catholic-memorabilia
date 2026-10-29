import { useProfileHooks } from '@/hooks/profile.hooks'
import { IProfile } from '@/interface/profile.interface'
import { updateProfile } from '@/services/profile.service'
import SkeletonInput from '@/shared/components/skeleton/input'
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const ProfileForm = () => {
    const queryClient = useQueryClient();
    const { profile, profileLoading } = useProfileHooks()
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm<IProfile>({
        defaultValues: {
            firstName: profile && profile?.firstName,
            lastName: profile && profile?.lastName,
            middleName: profile && profile?.middleName,
            contactNumber: profile && profile?.data?.contactNumber,
            email: profile && profile?.email,
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
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            middleName: profile?.middleName,
            contactNumber: profile?.contactNumber,
            email: profile?.email,
        })
    }, [profile])

    return (
        <form onSubmit={handleSubmit(profileSubmit)} autoComplete='off' className="px-6 py-6">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-6">
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
                                        {...register('firstName', { required: 'FirstName is required' })}
                                        onBlur={() => trigger('firstName')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.firstName ? 'border-error' : 'border-gray-350'} `}
                                    />
                                    {
                                        errors.firstName &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.firstName.message}</p>
                                    }
                                </>
                            )
                    }

                </div>
                <div className="col-span-6">
                    <label className="block mb-2" htmlFor="firstname">
                        Middle Name
                    </label>
                    {
                        profileLoading ? (
                            <SkeletonInput />
                        ) :
                            (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        {...register('middleName', { required: 'Middle Name is required' })}
                                        onBlur={() => trigger('firstName')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.middleName ? 'border-error' : 'border-gray-350'} `}
                                    />
                                    {
                                        errors.middleName &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.middleName.message}</p>
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
                                        {...register("lastName", { required: "Last Name is required" })}
                                        onBlur={() => trigger('lastName')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.lastName ? 'border-error' : 'border-gray-350'}`}
                                    />
                                    {
                                        errors.lastName &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.lastName.message}</p>
                                    }
                                </>
                            )
                    }
                </div>
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="email">
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
                                        defaultValue={profile?.email}
                                        className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border border-gray-350 read-only:bg-gray-350 "
                                    />
                                </>
                            )
                    }
                </div>
                <div className="col-span-12">
                    <label className="block mb-2" htmlFor="phone">
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
                                        {...register('contactNumber', {
                                            required: 'Phone number is required.',
                                            pattern: {
                                                value: /^\+614\d{8}$/,
                                                message: "Phone number must start with 9 and have 10 digits.",
                                            }
                                        })}
                                        placeholder="+61412345678"
                                        onBlur={() => trigger('contactNumber')}
                                        className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.contactNumber ? 'border-error' : 'border-gray-350'}`}
                                    />
                                    {
                                        errors.contactNumber &&
                                        <p className='text-error text-xs leading-[24px] mt-1'>{errors.contactNumber.message}</p>
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