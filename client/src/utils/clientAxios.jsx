import axios from "axios";
import { getItem } from "./localStroage";
import { setItem, removeItem, KEY_ACCESS_TOKEN } from "./localStroage";

const clientAxios = axios.create({
  baseURL: "https://backendsocialmedia-1-y8o4.onrender.com",
  withCredentials: true,
});

clientAxios.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = accessToken ? `Bearer ${accessToken}` : "";
  return request;
});

clientAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {

        const res = await clientAxios.post("/auth/refresh");
        const newAccessToken = res.data.result.AccessToken;
        setItem(KEY_ACCESS_TOKEN, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return clientAxios(originalRequest);
      } catch (refreshError) {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default clientAxios;


