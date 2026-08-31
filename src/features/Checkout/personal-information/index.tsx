import { IRegister } from '@/interface/register.interface';
import { registerGuestUser } from '@/services/auth.service';
import ButtonLoader from '@/shared/components/btn-loading';
import { generatePassword } from '@/shared/utils/cookies-utils/cookies.utils';
import { handleKeyDownAlphabet, handleKeyDownNumber } from '@/shared/utils/form-validation-utils';
import { TOAST_TYPES, showToast } from '@/shared/utils/toast-utils/toast.utils';
import { useQueryClient } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface PersonalInformationProps {
    addressCollapseDisabled: boolean;
    personalInfoSubmitted: boolean;
    setAddressCollapseDisabled: (disabled: boolean) => void;
    setPersonalInfoSubmitted: (disabled: boolean) => void;
    guestUserData: IRegister | null;
    setGuestUserData: (data: IRegister | null) => void;
    setPersonalOpen: (arg0: boolean) => void;
    setAddressOpen: (arg0: boolean) => void;
};

const PersonalInformation: React.FC<PersonalInformationProps> = ({
    addressCollapseDisabled,
    setAddressCollapseDisabled,
    personalInfoSubmitted,
    setPersonalInfoSubmitted,
    guestUserData,
    setGuestUserData,
    setPersonalOpen,
    setAddressOpen
}) => {
    const queryClient = useQueryClient();
    const router = useRouter()
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [generatedPassword, setGeneratedPassword] = useState<string>('');
    const { register, watch, handleSubmit: handleSubmitRegisterGuestUser, setValue, formState: { errors, isSubmitting, isValid }, trigger } = useForm<IRegister>();
    const onSubmitRegisterGuestUser: SubmitHandler<IRegister> = async (data) => {
        const generatedPwd = generatePasswordValue();
        data.password = generatedPwd;
        data.password_confirmation = generatedPwd;
        setGuestUserData(data);
        setSubmitLoading(true)
        setPersonalInfoSubmitted(false);
        setAddressCollapseDisabled(false);
        try {
            const guestUserResponse = await registerGuestUser(data, true);
            if(guestUserResponse.status===200){
                setCookie('token', guestUserResponse?.data?.data?.accessToken);
                setCookie('isLoggedIn', true)
                setPersonalOpen(false)
                setSubmitLoading(false)
                setPersonalInfoSubmitted(true);
                setAddressOpen(true)
                queryClient.invalidateQueries(['getCart'])
                queryClient.invalidateQueries(['getProfile'])
                router.push('/checkout')
            }
        } catch (error: any) {
            setSubmitLoading(false)
            setPersonalInfoSubmitted(false);
            setPersonalOpen(true)
            setAddressOpen(false)
            setAddressCollapseDisabled(true);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorArray = error.response.data.errors;
                errorArray.forEach((errorItem:any) => {
                    showToast(TOAST_TYPES.error, errorItem?.detail)
                });
              } 
        }
    };
    // Function to generate and set the initial password value
    const generatePasswordValue = () => {
        if (!generatedPassword) {
            const password = generatePassword(8);
            setGeneratedPassword(password);
            setValue('password', password);
            setValue('password_confirmation', password);
            return password;
        }
        return generatedPassword;
    };

    const watchedFields = watch();
    const isFormEmpty = Object.values(watchedFields).every((fieldValue) => fieldValue === '');

    return (
        <>
            <form onSubmit={handleSubmitRegisterGuestUser(onSubmitRegisterGuestUser)}>
                <div className="grid grid-cols-12 gap-4">
                    <div className="flex flex-col col-span-6 mb-[15px]">
                        <label className="label">
                            <span className="label-text">First Name<span className="asterick-icon text-red-250 ml-[3px] text-sm">*</span></span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your First Name"
                            onKeyUp={() => trigger('first_name')}
                            onKeyDown={() => { handleKeyDownAlphabet }}
                            className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border rounded-e"
                            {...register('first_name', { required: 'First name is required' })}
                        />
                        {
                            errors.first_name &&
                            <p className='text-error text-xs leading-[24px] mt-1'>{errors.first_name.message}</p>
                        }
                    </div>

                    <div className="flex flex-col col-span-6 mb-[15px]">
                        <label className="label">
                            <span className="label-text">Last Name<span className="asterick-icon text-red-250 ml-[3px] text-sm">*</span></span>
                        </label>
                        <input
                            type="text"
                            {...register("last_name", { required: 'Last name is required' })}
                            placeholder='Enter Your Last Name'
                            onKeyUp={() => trigger('last_name')}
                            onKeyDown={() => { handleKeyDownAlphabet }}
                            className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border rounded-e"
                        />
                        {
                            errors.last_name &&
                            <p className='text-error text-xs leading-[24px] mt-1'>{errors.last_name.message}</p>
                        }
                    </div>

                    <div className="flex flex-col col-span-6 mb-[15px]">
                        <label className="label">
                            <span className="label-text">Phone Number<span className="asterick-icon text-red-250 ml-[3px] text-sm">*</span></span>
                        </label>
                        <input
                            type="text"
                            {...register("mobile_number",
                                {
                                    required: "Phone number is required.",
                                    pattern: {
                                        value: /^98\d*$/,
                                        message: "Incorrect phone number format",
                                    }
                                })}
                            pattern="^[1-9]\d*$"
                            maxLength={10}
                            inputMode='numeric'
                            onKeyUp={() => trigger('mobile_number')}
                            onKeyDown={handleKeyDownNumber}
                            placeholder='Enter Your Phone Number'
                            className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border ${errors.mobile_number ? 'border-error' : 'border-gray-350'}`}
                        />
                        {
                            errors.mobile_number &&
                            <p className='text-error text-xs leading-[24px] mt-1'>{errors.mobile_number.message}</p>
                        }
                    </div>

                    <div className="flex flex-col col-span-6 mb-[15px]">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            {...register("email", {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            onKeyDown={() => trigger("email")}
                            placeholder='Enter Your Email'
                            className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border rounded-e"
                        />
                        {
                            errors.email &&
                            <p className='text-error text-xs leading-[24px] mt-1'>{errors.email.message}</p>
                        }
                    </div>
                    <div className="col-span-12 text-right">
                        <button
                            disabled={isFormEmpty}
                            type="submit"
                            className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-primary flex justify-end items-center gap-2 ml-auto text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                        >
                            Next
                            {
                                submitLoading &&
                                <ButtonLoader className='!block' />
                            }
                        </button>
                    </div>

                </div>

            </form>
        </>

    )
}

export default PersonalInformation