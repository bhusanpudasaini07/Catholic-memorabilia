import { IContactUs } from '@/interface/contact-us.interface';
import { feedBackOption, sendFeedback } from '@/services/contact.service';
import { getProfile } from '@/services/profile.service';
import ButtonLoader from '@/shared/components/btn-loading'
import CaretDownIcon from '@/shared/icons/common/CaretDownIcon';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

// export interface IFeedBackOptions {
//     id: number,
//     title: string
// }

const ContactUsForm = () => {
    const router = useRouter()
    const token = getToken()
    const [options, setOptions] = useState<Array<Object>>([{}]);

    const [selectedType, setSelectedType] = useState("Please Select");

    const handleTypeChange = (text: string) => {
        setSelectedType(text);
    };

    const { data: showProfileData } = useQuery({
        queryKey: ['getProfile', token],
        queryFn: getProfile,
        enabled: !!token
    }
    )

    const { data: feedback, } = useQuery(['getFeedbackOptions'], feedBackOption)
    const { register, handleSubmit, control, formState: { errors }, trigger, reset } = useForm<IContactUs>({
        defaultValues: {
            context: '',
            department: selectedType,
            email: '',
            first_name: '',
            last_name: '',
            mobile_number: '',
        }
    })
    const mutation = useMutation({
        mutationFn: sendFeedback,
        onSuccess: () => {
            showToast(TOAST_TYPES.success, 'Message Was Successfully Sent!');
            router.push('/');
        },
    })
    const feedBackSubmit = (data: IContactUs) => {
        mutation.mutate(data)
        reset()
    }
    useEffect(() => {
        if (showProfileData) {
            reset({
                ...showProfileData?.data,
                first_name: `${showProfileData?.data?.firstName}`,
                last_name: `${showProfileData?.data?.lastName}`,
                mobile_number: showProfileData?.data?.mobileNumber
            })
        }
    }, [showProfileData])

    useEffect(() => {
        if (feedback) {
            setOptions(feedback?.data)
        }
    }, [feedback])

    return (
        <div className='my-[60px] p-[40px] max-w-[700px] mx-auto bg-gray-1250'>
            <h5 className='mb-5 text-2xl font-bold text-slate-850'>Get In Touch</h5>
            <form onSubmit={handleSubmit(feedBackSubmit)}>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-6">
                        <input
                            {...register("first_name", { required: 'Your first name is required.' })}
                            type="text"
                            placeholder="First Name"
                            className={`capitalize px-3.5 text-black h-[45px] w-full outline-0 text-sm border  bg-transparent ${errors?.first_name ? 'border-error' : 'border-zinc-450'}`}
                            onBlur={() => trigger("first_name")}
                        />
                        {
                            errors?.first_name &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.first_name?.message}</p>
                        }
                    </div>
                    <div className="col-span-6">
                        <input
                            {...register("last_name", { required: 'Your last name is required.' })}
                            type="text"
                            placeholder="Last Name"
                            className={`capitalize px-3.5 text-black h-[45px] w-full outline-0 text-sm border  bg-transparent ${errors?.last_name ? 'border-error' : 'border-zinc-450'}`}
                            onBlur={() => trigger("last_name")}
                        />
                        {
                            errors?.last_name &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.last_name?.message}</p>
                        }
                    </div>
                    <div className="col-span-6">
                        <input
                            type="text"
                            placeholder="Email"
                            className={`px-3.5 text-black h-[45px] w-full outline-0 text-sm border bg-transparent ${errors?.email ? 'border-error' : 'border-zinc-450'}`}
                            {...register("email", {
                                required: 'Email is required.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address.",
                                },
                            })}
                            onBlur={() => trigger("email")}
                        />
                        {
                            errors?.email &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.email?.message}</p>
                        }
                    </div>
                    <div className="col-span-6">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className={`px-3.5 text-black h-[45px] w-full outline-0 text-sm border bg-transparent ${errors?.mobile_number ? 'border-error' : 'border-zinc-450'}`}
                            {...register("mobile_number", {
                                required: 'Phone number is required.',
                                pattern: {
                                    value: /^[9]\d{9}$/,
                                    message: "Phone number must start with 9 and have 10 digits.",
                                }
                            })}
                            onBlur={() => trigger("mobile_number")}
                        />
                        {
                            errors?.mobile_number &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.mobile_number?.message}</p>
                        }
                    </div>
                    <div className="col-span-12">
                        <Controller
                            name='department'
                            control={control}
                            rules={{ required: 'Department is required.' }}
                            // onChange={ handleTypeChange(option?.title)}
                            render={({ field }) => (

                                <div className="block dropdown">

                                    <label
                                        tabIndex={0}
                                        htmlFor={field?.name}
                                        className="flex items-center justify-between min-w-full gap-1 px-4 py-2 text-sm font-normal text-black bg-transparent border border-zinc-450 whitespace-nowrap"
                                    >
                                        <span className="capitalize">{field?.value}</span>
                                        <CaretDownIcon />
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu shadow p-0 bg-base-100 rounded-sm w-full z-[60]"
                                    >
                                        {options.map((option: any) => (
                                            <li key={option?.id}
                                                onClick={() => {
                                                    field.onChange(option?.title); // Update the form control value
                                                    handleTypeChange(option?.title); // Update your state or value using handleTypeChange
                                                }}
                                                // onClick={() => handleTypeChange(option?.title)}
                                                className={`hover:!bg-[#f5faff] ${option?.title === selectedType ? 'bg-[#ebf5ff]' : ''}`}>
                                                <span className='border-0 rounded-none bg-none hover:!bg-none'>{option?.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        />

                        {
                            errors?.department &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.department?.message}</p>
                        }
                    </div>
                    <div className="col-span-12">
                        <textarea {...register("context", {
                            required: "Message is required.",
                            minLength: {
                                value: 20,
                                message: "Message should be at least 20 characters long."
                            }
                        })}
                            placeholder='Message Here'
                            className={`p-3.5 text-black min-h-[200px] w-full outline-0 text-sm border bg-transparent resize-none ${errors?.context ? 'border-error' : 'border-zinc-450'}`}></textarea>
                        {
                            errors?.context &&
                            <p className="text-error text-xs leading-[24px] mt-1">{errors?.context?.message}</p>
                        }
                    </div>
                    <div className="flex justify-between col-span-12">
                        <button
                            type='submit'
                            disabled={mutation?.isLoading}
                            className="btn btn-primary text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white"
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
        </div>
    )
}

export default ContactUsForm