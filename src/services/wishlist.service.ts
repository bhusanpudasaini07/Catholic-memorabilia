import axiosInstance, { setAuthorizationHeader } from "@/axios/axiosInstance";


export const getWishlists = async (page: number, perPage: number) => {
  try {
    const response = await axiosInstance.get(
      `/products/favorites`,
      {
        params: {
          page,
          perPage,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllWishlistProducts = async (token: any) => {
  setAuthorizationHeader();
  if (token) {
    try {
      const response = await axiosInstance.get(
        `/products/favorite/list`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
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
