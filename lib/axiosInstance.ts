import axios from "axios"

const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api/" : "https://fundwavesl.vercel.app/api/"

export const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = sessionStorage.getItem('session');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);