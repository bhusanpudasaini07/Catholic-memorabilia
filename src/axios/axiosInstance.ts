import axios from "axios";
// import { clearLocalStorage } from "../utils/localStorage.util";
import { config } from "../../config";
import {
  getCartNumber,
  getToken,
  getWareId,
} from "@/shared/utils/cookies-utils/cookies.utils";
import { getCookie } from "cookies-next";
// import { getCoupon } from "@/shared/utils/local-storage-utils/local-storage.utils";

const apiURL = config.gateway.apiURL;
const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    Accept: "application/json",
    ...(getCartNumber() && { "Cart-Number": getCartNumber() }),
    // ...(getCoupon() && { Coupon: getCoupon() }),
    "Api-Key": config.gateway.apiKey,
    "Warehouse-Id": getWareId() || 4,
  },
});

// Function to set the Authorization header dynamically
export const setAuthorizationHeader = () => {
  const token = getToken();
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Call the function initially to set the Authorization header if the token is available.
setAuthorizationHeader();

export const setCouponHeader = (params: { coupon?: string | undefined }) => {
  if (params.coupon) {
    // axiosInstance.defaults.headers.common['Coupon'] = getCookie('coupon') || (coupon as string);
    axiosInstance.defaults.headers.common["Coupon"] = params.coupon as string;
  } else {
    delete axiosInstance.defaults.headers.common["Coupon"];
  }
};

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.message === "Network Error") {
      return new Error("Network Error");
    }

    if (error.response.status === 306 && !originalConfig._retry) {
      return axiosInstance;
    }

    if (error.response.data.code == 1006) {
      if (!originalConfig._retry) {
        originalConfig._retry = true;
        try {
          await axiosInstance.post("/refresh", {}, { withCredentials: true });
          return axiosInstance(originalConfig);
        } catch (error: any) {
          if (error.response && error.response.data) {
            if (window.location.pathname !== "/login") {
              window.localStorage.setItem(
                "sessionmessage",
                JSON.stringify({
                  message: "Your session has expired!",
                  type: "error",
                })
              );
              history.pushState(null, "", "/login");
            }
            return Promise.reject(error);
          }
        }
      }
      return {
        ...originalConfig,
        cancelToken: new axios.CancelToken((cancel) =>
          cancel("Cancel repeated request")
        ),
      };
    }

    return Promise.reject({
      ...error,
      response: error.response,
      message: error?.message,
      status: error.response.status,
    });
  }
);

export default axiosInstance;
