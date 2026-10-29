import axiosInstance, { setAuthorizationHeader } from "@/axios/axiosInstance";


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

export const getRelatedProductsFromId = async (
  catId: any,
  sortOrder?: string,
  sortBy?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const limit = 10;
  const params = new URLSearchParams({ limit: String(limit) });

  if (
    typeof minPrice === "number" &&
    typeof maxPrice === "number" &&
    Number.isFinite(minPrice) &&
    Number.isFinite(maxPrice)
  ) {
    params.set("minPrice", String(minPrice));
    params.set("maxPrice", String(maxPrice));
  }

  try {
    const response = await axiosInstance.get(
      `/products/related/${catId}?${params.toString()}&sortOrder=${sortOrder ?? ''}&sortBy=${sortBy ?? 'alphabet'}`
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

export const getFeaturedProducts = async () => {
  try {
    const response = await axiosInstance.get(`/products/featured?limit=10`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewArrivalProducts = async () => {
  try {
    const response = await axiosInstance.get(`/products/new-arrivals?limit=10`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductReviews = async (productId: any) => {
  try {
    
    const response = await axiosInstance.get(`/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProductReview = async (productId: any, review: any) => {
  try {
    setAuthorizationHeader();
    const response = await axiosInstance.post(`/products/${productId}/reviews`, review);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductReview = async (productId: any, reviewId: any, review: any) => {
  try {
    setAuthorizationHeader();
    const response = await axiosInstance.patch(`/products/${productId}/reviews/me`, review);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductReview = async (productId: any, reviewId: any) => {
  try {
    setAuthorizationHeader();
    const response = await axiosInstance.delete(`/products/${productId}/reviews/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};