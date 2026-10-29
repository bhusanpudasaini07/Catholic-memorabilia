import React, { FC, useEffect, useRef, useState } from 'react';

import Image from "next/image";
import { FiEdit } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProfile, uploadProfileImage } from '@/services/profile.service';
import { showToast, TOAST_TYPES } from '@/shared/utils/toast-utils/toast.utils';
import SkeletonProfileLoading from '@/shared/components/skeleton/profile';
import { getCookie } from 'cookies-next';
import { useProfileHooks } from '@/hooks/profile.hooks';

const ProfileImage = () => {
  const queryClient = useQueryClient();
  const { profile, profileLoading } = useProfileHooks()
  /**
   * Use States
   */
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  
  const profileImageMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, 'Profile image updated successfully');
      queryClient.invalidateQueries(['getProfile'])
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors
      showToast(TOAST_TYPES.error, errors[0]?.message)
    },
  })

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg"];
    const maxSize = 3; // MB

    // Validation
    let newErrorMessage: string | null = null;

    if (!allowedTypes.includes(file.type)) {
      newErrorMessage = "Only Images are allowed ( JPG | PNG )";
    }
    if (file.size / 1024 / 1024 > maxSize) {
      newErrorMessage = `Maximum size allowed is ${maxSize}MB`;
    }



    if (!newErrorMessage) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const profileImageBase64 = reader.result as string;
        setSelectedImage(profileImageBase64)
        handleImageProfile(file);
        setErrorMessage('');
      };
    } else {
      setErrorMessage(newErrorMessage);
    }
  };

  const handleEditButtonClick = () => {
    fileInputRef.current?.click();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageProfile = (file: File) => {
    const formData = new FormData();
    formData.append('firstName', profile?.firstName);
    formData.append('middleName', profile?.middleName);
    formData.append('lastName', profile?.lastName);
    formData.append('contactNumber', profile?.contactNumber);
    formData.append('addressLine1', profile?.addressLine1);
    formData.append('suburb', profile?.suburb);
    formData.append('state', profile?.state);
    formData.append('postcode', profile?.postcode);
    formData.append('profileImage', file);
    profileImageMutation.mutate(formData as any);
  }

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);


  /**
   * Use effects
   */
  useEffect(() => {
    if (profile) {
      setSelectedImage(profile?.profileImageUrl || '')
    }
  }, [profile])

  return (
    <div className="">
      <div className="relative w-[130px] h-auto m-auto">
        {
          profileLoading ? (
            <SkeletonProfileLoading />
          ) : (
            <Image
              width={200}
              height={200}
              src={selectedImage}
              alt="User image"
              className="object-cover w-full m-auto border rounded-full aspect-square border-gray-950"
            />
          )
        }
        <button
          className="absolute top-0 right-0 flex flex-col items-center justify-center gap-3 p-2 text-center bg-white border rounded-full hover:text-primary hover:border-primary hover:bg-gray-200"
          onClick={handleEditButtonClick}
        >
          <label
            htmlFor="fileInput"
            className="hidden block w-full text-sm cursor-pointer text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          >
            Choose File
          </label>
          <input
            id="fileInput"
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <FiEdit className="text-[19px] tetx-slate-850" />
        </button>
      </div>
      {errorMessage && <div className="text-error text-xs leading-[16px] mt-2 text-center">{errorMessage}</div>}
      {/* Image Upload */}
    </div>

  )
}

export default ProfileImage