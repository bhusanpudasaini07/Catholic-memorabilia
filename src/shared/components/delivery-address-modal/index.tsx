import { IDeliveryAddress } from '@/interface/delivery-address.interface';
import { addDeliverAddress, getDeliverAddress, updateDeliveryAddressByAddressId } from '@/services/delivery-address.service';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { showToast, TOAST_TYPES } from '@/shared/utils/toast-utils/toast.utils';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import ButtonLoader from '../btn-loading';

const LeafletMap = dynamic(() => import('@/shared/components/leaflet'), {
  ssr: false,
});

interface IProps {
  formData: IDeliveryAddress;
  setFormData: (arg1: any) => void;
  setShowModal: (arg2: any) => void;
  setIsEditing: (arg3: any) => void;
  isEditing: boolean;

}

const DeliveryAddressModal: React.FC<IProps> = ({
  formData,
  setFormData,
  setShowModal,
  setIsEditing,
  isEditing }) => {

  const [addressSaved, setAddressSaved] = useState(false);
  const token = getToken();
  const handleMarkerClick = (lat: any, lng: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      lat,
      lng,
    }));
  };

  const phoneNumberRegex = /^(97|98)\d{8}$/;


  const { data: deliveryAddressData, refetch: getDeliveryAddress } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token
  });


  const fetchDeliveryAddress = async () => {
    await getDeliveryAddress();
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddressSaved(true);
    if (formData.lat === 0 || formData.lng === 0) {
      showToast(TOAST_TYPES.error, 'Please select a location');
      setAddressSaved(false);
      return;
    }
    if (!phoneNumberRegex.test(formData.mobile_number)) {
      return;
    }
    if (isEditing) {
      try {

        await updateDeliveryAddressByAddressId(formData);
        getDeliveryAddress();
        setAddressSaved(false);
        setShowModal(false);
      } catch (error: any) {
        showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.detail)
      }
    } else {
      try {
        await addDeliverAddress(formData);
        getDeliveryAddress();
        setShowModal(false);
      } catch (error: any) {
        showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.detail)
      }
    }
  };


  return (
    <>
      <input
        type="checkbox"
        id="mymodal"
        className="modal-toggle"
        defaultChecked
      />
      <div className="modal">
        <div className="p-0 overflow-auto relative rounded-lg modal-box">
          <div className="pb-2 border-b border-gray-300 sticky top-0 bg-white z-[9999] w-full left-0 pl-8 pt-8 ">
            <h3 className="text-lg font-medium">
              SET DELIEVERY LOCATION
            </h3>
            <p className="text-sm text-primary">
              {" "}
              Drag the map to pin point your delievery lcoation{" "}
            </p>
          </div>


          <form action="" className="p-4" onSubmit={handleSubmit}>
            <div className="h-[280px] mb-3">
              <LeafletMap
                lat={formData.lat || 27.7172}
                long={formData.lng || 85.3240}
                onChange={handleMarkerClick}
              />
            </div>

            <label
              htmlFor="addresstitle"
              className="block mb-2 text-sm"
            >
              {" "}
              Address Title <span className="text-red-250">*</span>
            </label>

            <input
              type="text"
              id="addresstitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4`}
              required
              maxLength={80}
              pattern="^[a-zA-Z0-9, a-zA-Z0-9 ]*$"
            />

            <label
              htmlFor="fullname"
              className="block mb-2 text-sm"
            >
              {" "}
              Full Name
            </label>

            <input
              type="text"
              id="fullname"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={40}
              pattern="^[a-zA-Z ]*$"
              className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4"
            />

            <label
              htmlFor="number"
              className="block mb-2 text-sm"
            >
              {" "}
              Phone number
            </label>

            <input
              type="number"
              id="number"
              value={formData.mobile_number}
              onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
              pattern="(9[7,8])[0-9]{8}"

              className="px-3.5 text-gray-650 h-[45px] w-full outline-0 text-sm border mb-4"
            />
            {formData.mobile_number.length > 0 && !phoneNumberRegex.test(formData.mobile_number) && (
              <p className="pb-2 text-sm text-red-500">Incorrect phone format</p>
            )}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="check"
                checked={formData.default}
                onChange={(e) =>
                  setFormData({ ...formData, default: e.target.checked })
                }
              />

              <label htmlFor="check" className="text-sm">
                Set As Default
              </label>

            </div>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn-error rounded-[30px] px-[30px] py-[11px]"
              >
                Cancel
              </button>
              {isEditing ? (
                <button type="submit" className="btn rounded-[30px] px-[30px] py-[11px]">
                  Update
                </button>
              ) : (
                <button type="submit" className="btn rounded-[30px] px-[30px] py-[11px]" disabled={addressSaved}>
                  Save
                  {
                    addressSaved &&
                    <ButtonLoader />
                  }
                </button>
              )}
            </div>
          </form>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="mymodal"
        ></label>
      </div>
    </>
  )
}

export default DeliveryAddressModal