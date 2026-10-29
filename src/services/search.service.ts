import axiosInstance from "@/axios/axiosInstance";



export const getSearchResults = async (
  type?: string,
  keyword?: string,
) => {
  try {
    const response = await axiosInstance.get(`/products/suggest`, {
      params: {
        type,
        keyword,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

//suggestion
export const getSuggestionResults = async (type?: string, keyword?: string) => {
  try {
    const response = await axiosInstance.get(`/products/suggest`, {
      params: {
        type,
        keyword,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
