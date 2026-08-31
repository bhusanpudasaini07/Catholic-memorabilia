import axiosInstance, {
  setAuthorizationHeader,
  setCouponHeader,
} from "@/axios/axiosInstance";
import { ICreateCartItem } from "@/interface/cart.interface";
import { CookieKeys } from "@/shared/enum";
import {
  getCartNumber,
  getWareId,
} from "@/shared/utils/cookies-utils/cookies.utils";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { config } from "../../config";

const apiURL = config.gateway.apiURL;
const apiEndPoint1 = config.gateway.apiEndPoint1;
const apiEndPoint2 = config.gateway.apiEndPoint2;

// export const setCartNumberCookie = async () => {
//   try {
//     const response = await axiosInstance.get(`/cart`);
//     if (response.status === 200) {
//       setCookie(CookieKeys.CARTNUMBER, response?.data?.data?.cartNumber);
//     }
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getCartData = async (params: { coupon?: string }) => {
  try {
    if (params.coupon) {
      setCouponHeader({
        coupon: params.coupon,
      });
    } else {
      setCouponHeader({
        coupon: "",
      });
    }
    setAuthorizationHeader();
    const response = await axiosInstance.get(`/${apiEndPoint2}/carts`);
    if (!getCookie(CookieKeys.CARTNUMBER)) {
      setCookie(CookieKeys.CARTNUMBER, response?.data?.data?.cartNumber);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCartProduct = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint2}/cart-products`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItemById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(
      `/${apiEndPoint2}/cart-products/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (data: ICreateCartItem) => {
  try {
    const response = await axiosInstance.post(
      `/${apiEndPoint2}/cart-products`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const updateCart = async (data: IUpdateCartItem) => {
//   const payload = {
//     ...data,
//   };
//   delete payload.product_number;
//   try {
//     const response = await axiosInstance.patch(
//       `/cart-product/${data.product_number}`,
//       payload
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const bulkDeleteCart = async () => {
  try {
    const response = await axiosInstance.delete(`/${apiEndPoint1}/carts`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const associateCart = async (auth: any, status: string) => {
  const associateCartUrl = `${apiURL}/${apiEndPoint1}/cart/associate`;

  const headers = {
    ...(getCartNumber() && { "Cart-Number": getCartNumber() }),
    // ...(getCoupon() && { Coupon: getCoupon() }),

    Authorization: `Bearer ${auth}`,
    "Api-Key": config.gateway.apiKey,
    "Warehouse-Id": getWareId() || 4,
  };
  if (status === "true" || status === "false") {
    headers["Flush-Old-Cart"] = status;
  }

  try {
    const response = await axios.get(`${associateCartUrl}`, { headers });
    return { response, error: null };
  } catch (error) {
    return { response: null, error };
  }
};

export const addCouponCode = async (code: string) => {
  try {
    const response = await axiosInstance.get(
      `/${apiEndPoint1}/carts/coupon/${code}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.errors;
  }
};
