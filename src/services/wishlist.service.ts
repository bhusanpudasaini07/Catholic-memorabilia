import axiosInstance, { setAuthorizationHeader } from "@/axios/axiosInstance";


export const getWishlists = async () => {
  try {
    const response = await axiosInstance.get(
      `/products/favorites`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateProductInWishlist = async (id: number) => {
  try {
    const response = await axiosInstance.post(
      `/products/${id}/favorite`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
