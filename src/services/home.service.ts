import axiosInstance from "@/axios/axiosInstance";
import { addWareHouseToStorage } from "@/shared/utils/cookies-utils/cookies.utils";
import { config } from "../../config";

const apiEndPoint1 = config.gateway.apiEndPoint1;

export const getCategoriesList = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint1}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHomeData = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint1}/web-home`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfig = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint1}/configs`);
    addWareHouseToStorage(response?.data?.data?.warehouses);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBannerPopup = async () => {
  try {
    const response = await axiosInstance.get(
      `${apiEndPoint1}/banner?type=popup`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
