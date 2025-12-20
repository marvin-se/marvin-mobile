import axios, { InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/utils/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                await removeToken();
            }

            return Promise.reject({
                status,
                message: data.message || "An error occurred",
                errors: data?.errors || null
            })
        }
        else if (error.request) {
            return Promise.reject({
                message: "No response received from server"
            })
        }

        return Promise.reject({
            message: error.message
        })
    }
)

export default apiClient;