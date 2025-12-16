import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(
    (config) => {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5aWxtYXpzZWwyMUBpdHUuZWR1LnRyIiwiaWF0IjoxNzY1OTE0ODgxLCJleHAiOjE3NjU5MTU4ODF9.agxZe4k-hzy27-dyxmP5ci7xLABh7wbN2CeZUxlGAyY";
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
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                //
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