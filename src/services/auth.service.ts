import axiosInstance, { setCouponHeader } from "@/axios/axiosInstance";
import { config } from "../../config";
import {
  IChangePassword,
  IForgotPassword,
  IResetPassword,
} from "@/interface/password.interface";
import axios from "axios";
import {
  getCartNumber,
  getWareId,
} from "@/shared/utils/cookies-utils/cookies.utils";
const apiURL = config.gateway.apiURL;


export const signUp = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/auth/sign-up`, data);

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, data);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.get(`/auth/sign-out`);
    if (response.status === 204) {
      setCouponHeader({
        coupon: "",
      });
      return response;
    }
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (account: IForgotPassword) => {
  try {
    const response = await axiosInstance.post(
      `/auth/forget-password`,
      account,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (resetPasswordBody: IResetPassword) => {
  try {
    const response = await axiosInstance.post(
      `/auth/reset-password`,
      resetPasswordBody,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (changePasswordBody: IChangePassword) => {
  try {
    const response = await axiosInstance.post(
      `/auth/change-password`,
      changePasswordBody,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export async function verifyEmail(token: string) {
  try {
    const response = await axiosInstance.post(`auth/verify-email`, { token });
    return response;
  } catch (error) {
    throw error;
  }
}
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.post(`/auth/user/delete`, {
      reason: "",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerGuestUser = async (data: any, isInitialSubmit: any) => {
  const registerGuestUserUrl = `${apiURL}/guest/register`;
  let payload;
  if (isInitialSubmit) {
    payload = {
      password_confirmation: data.password_confirmation,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      password: data.password,
    };
  } else {
    payload = {
      password_confirmation: data.password_confirmation,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      password: data.password,
    };
  }

  try {
    const response = await axios.post(`${registerGuestUserUrl}`, payload, {
      headers: {
        "Cart-Number": getCartNumber(),
        "Api-Key": config.gateway.apiKey,
        "Warehouse-Id": getWareId(),
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
