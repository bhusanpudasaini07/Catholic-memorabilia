import axiosInstance, { setAuthorizationHeader } from "@/axios/axiosInstance";
import { IProfileImage, IProfileSubmit } from "@/interface/profile.interface";

import axios from "axios";
import { config } from "../../config";
import { getCookie } from "cookies-next";
const apiURL = config.gateway.apiURL;
const apiEndPoint1 = config.gateway.apiEndPoint1;

export const getProfile = async () => {
  try {
    setAuthorizationHeader();
    const response = await axiosInstance.get(`/users/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data: IProfileSubmit) => {
  try {
    const response = await axiosInstance.put(
      `/user/update`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadProfileImage = async (avatar: File) => {
  const imageUrl = `/profile/image`;

  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await axios.post(imageUrl, formData, {
      headers: {
        Authorization: `Bearer ${getCookie('isLoggedIn')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
