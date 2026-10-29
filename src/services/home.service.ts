import axiosInstance from "@/axios/axiosInstance";


export const getBanner = async () => {
  try {
    const response = await axiosInstance.get(`/banners/published`);
    return response.data;
  } catch (error) {
    throw error;
  }

};

export const getAllBundles = async () => {
  try {
    const response = await axiosInstance.get('/bundles/published');
    return response.data;
  } catch (error) {
    throw error;
  }

};


  export const getCategoriesList = async () => {
    try {
      const response = await axiosInstance.get(`/categories`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

