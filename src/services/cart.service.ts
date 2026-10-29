
import { readGuestCart, writeGuestCart, addGuestCartItem, addGuestBundleItem, removeGuestCartItem, validateQuantity } from "./guest-cart";
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


const loggedIn = () => Boolean(getCookie('isLoggedIn'));
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
  if (!loggedIn()) return readGuestCart();
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
    const response = await axiosInstance.get(`/carts`);
    if (!getCookie(CookieKeys.CARTNUMBER)) {
      setCookie(CookieKeys.CARTNUMBER, response?.data?.data?.cartNumber);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCartProduct = async () => {
  if (!loggedIn()) {
    if (typeof window === 'undefined') {
      throw new Error('Guest cart is available in the browser');
    }
    return readGuestCart();
  }
  setAuthorizationHeader();
  try {
    const response = await axiosInstance.get(`/carts`);
    const cart = response.data?.items ? response.data : response.data?.data;
    return cart ?? { items: [] };
  } catch (error) {
    throw error;
  }
};

export const deleteCartItemById = async (productId: number, bundleId?: number) => {
  if (!loggedIn()) {
    return removeGuestCartItem(productId, bundleId);
  }
  setAuthorizationHeader();
  try {
    const response = await axiosInstance.delete(
      bundleId ? `/carts/items/${bundleId}?itemType=bundle` : `/carts/items/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (data: ICreateCartItem) => {
  validateQuantity(data.quantity);
  if (data.bundleId) {
    if (!loggedIn()) return addGuestBundleItem(data);
    setAuthorizationHeader();
    try {
      const response = await axiosInstance.post(`/carts/items`, {
        productId: data.bundleId,
        quantity: data.quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  if (!loggedIn()){
    return addGuestCartItem(data as { productId: number; quantity: number; product?: any });
  } else {
  setAuthorizationHeader();
  const { product, ...payload } = data;
  try {
      const response = await axiosInstance.post(
        `/carts/items`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const updateCart = async (data: any) => {
  validateQuantity(data.quantity);
  if (!loggedIn()) return writeGuestCart(readGuestCart().items.map(item => {
    if (data.bundleId) return item.bundleId === data.bundleId ? { ...item, quantity: data.quantity } : item;
    return !item.bundleId && item.productId === data.productId ? { ...item, quantity: data.quantity } : item;
  }));
  setAuthorizationHeader();
  const payload = {
    ...data,
  };
  delete payload.productId;
  delete payload.bundleId;
  try {
    const response = await axiosInstance.patch(
      data.bundleId ? `/carts/items/${data.bundleId}?itemType=bundle` : `/carts/items/${data.productId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bulkDeleteCart = async () => {

  if (!loggedIn()) return writeGuestCart([]);
  setAuthorizationHeader();
  try {
    const response = await axiosInstance.delete(`/carts`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const associateCart = async (auth: any, status: string) => {
  const associateCartUrl = `/cart/associate`;

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


