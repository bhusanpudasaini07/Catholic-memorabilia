import axiosInstance from "@/axios/axiosInstance";
import { config } from "../../config";


export const getOffers = async (
  search: any,
  page: any,
  limit: any,
  offer: any,
  sortBy?: string,
  sortOrder?: string,
) => {
  try {
    const response = await axiosInstance.get(`/products`, {
      params: {
        search,
        page,
        limit,
        offer,
        sortBy,
        sortOrder,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
