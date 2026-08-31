import { IDeliveryAddress } from '@/interface/delivery-address.interface';
import { deleteDeliverAddressById, getDeliverAddress } from '@/services/delivery-address.service';
import ButtonLoader from '@/shared/components/btn-loading';
import NewAddressIcon from '@/shared/icons/common/NewAddressIcon';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { showToast, TOAST_TYPES } from '@/shared/utils/toast-utils/toast.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect, useState } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

interface IProps {
  setShowModal: (arg2: any) => void;
  showModal: boolean;
  formData: IDeliveryAddress;
  setFormData: (arg1: any) => void;
  setIsEditing: (arg0:boolean) => void

}

const Address: React.FC<IProps> = ({
  setShowModal,
  showModal,
  formData,
  setFormData,
  setIsEditing,
}) => {
  const queryClient = useQueryClient();
  const token = getToken()
  const [deliveryAddressId, setDeliveryAddressId] = useState<string>('')
  const { data: deliveryAddressData } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token
  });


  const handleAddNew = () => {
    // Reset the form data when adding a new address
    setFormData({
      address: '',
      mobile_number: '',
      name: '',
      default: false,
      lat: 0,
      lng: 0,
      title: '',
    });
    // Set isEditing to false when adding
    setIsEditing(false);
    // Show the modal for adding
    setShowModal(true);
  };

  //Edit the delivery address list
  const handleEdit = (addressId: any) => {
    // For finfing  address object with the specified ID
    const addressData = deliveryAddressData.find((address: any) => address.id === addressId);
    if (addressData) {
      setFormData({
        ...formData,
        id: addressData?.id,
        title: addressData?.title,
        name: addressData?.name,
        mobile_number: addressData?.mobileNumber,
        lat: addressData?.lat,
        lng: addressData?.lng,
        default: addressData?.isDefault
      });
      // Set isEditing to true when editing
      setIsEditing(true);
      // Show the modal for editing
      setShowModal(true);
    } else {
      // Handle the case when addressData is not found
      console.error('Address not found.');
    }
  };

  const deleteAdddressMutation = useMutation({
    mutationFn: deleteDeliverAddressById,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, 'Delivery Address has been deleted');
      queryClient.invalidateQueries(['getDeliverAddress'])
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      showToast(TOAST_TYPES.error, errors[0]?.message);
    }
  })

  //Delete Address
  const handleDeleteAddress = async (id: any) => {
    setDeliveryAddressId(id)
    deleteAdddressMutation.mutate(id)
  };


  return (
    <>
      {deliveryAddressData?.length < 3 ? (
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 border boder-solid boder-grey-500 min-h-[170px]">
          <button
            onClick={handleAddNew}
            className="w-full h-full flex gap-3 flex-col items-center justify-center text-center hover:bg-gray-200"
          >
            <NewAddressIcon />
            <span className="text-center">Add New Location</span>
          </button>
        </div>
      ) : null}
      {deliveryAddressData?.map((deliveryAddressContent: any, index: any) => (
        <div className={`col-span-12 sm:col-span-6 lg:col-span-4 border boder-solid boder-grey-500 min-h-[170px] p-4 ${deliveryAddressContent.isDefault ? 'border-green-50' : ''}`} key={deliveryAddressContent.id}>
          <h5 className="mb-2">{deliveryAddressContent?.name}</h5>
          <p className="text-sm mb-1">{deliveryAddressContent?.title}</p>
          <p className="text-sm mb-1">{deliveryAddressContent?.detail?.formatted_address}</p>
          <p className="text-sm mb-1 font-medium">Phone: {deliveryAddressContent?.mobileNumber}</p>
          <div className="flex gap-6">
            <button
              disabled={(deliveryAddressContent?.id === deliveryAddressId && deleteAdddressMutation.isLoading)}
              className="flex items-center gap-1"
              onClick={() => handleDeleteAddress(deliveryAddressContent?.id)}>

              {
                (deliveryAddressContent?.id === deliveryAddressId && deleteAdddressMutation.isLoading) ?
                  <ButtonLoader className="!border-primary !block" />
                  :
                  <FaTrashAlt className="text-gray-400" />
              }
                    Remove

              </button>
            <button
              onClick={() => handleEdit(deliveryAddressContent?.id)}
              className="flex items-center gap-1"

            >
              <FaPencilAlt className="text-gray-400" />
                    Edit
                  </button>
          </div>
        </div>
      ))}
    </>

  )
}

export default Address

