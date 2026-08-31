import axiosInstance from '@/axios/axiosInstance';
import { CookieKeys } from '@/shared/enum';
import { getCookie } from 'cookies-next';

export const checkout = async (
  delivery_address_id: any, 
  payment_method_id: any,
  note: any) => {
  try {
    const payload = {
      delivery_address_id: delivery_address_id,
      payment_method_id: payment_method_id,
      note: note
    };
    const response = await axiosInstance.post("/v1/checkout", payload);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getCartNumber = (): any => {
  let number = getCookie(CookieKeys.CARTNUMBER);
  return number || "";
};
