import axiosInstance from "@/axios/axiosInstance";


export const getProductsFromSlug = async (productSlug: any) => {
  try {
    const response = await axiosInstance.get(
      `/products/${productSlug}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRelatedProductsFromId = async (catId: any) => {
  let limit = 10;
  try {
    const response = await axiosInstance.get(
      `/products/related/${catId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductByCategory = async (
  query: any,
  page: any,
  categoryId: any,
  minPrice: any,
  maxPrice: any,
  sortBy: string,
  priceOrder: string
) => {
  try {
    let url = `/products?keyword=${query}&page=${page}&categoryId=${categoryId}&sortBy=${sortBy}&priceOrder=${priceOrder}&allProduct=1`;

    if (minPrice !== "" && maxPrice !== "") {
      url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get(`/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};