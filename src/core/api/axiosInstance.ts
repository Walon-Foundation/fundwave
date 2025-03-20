import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
}, (error) => Promise.reject(error));


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                Cookies.remove("accessToken");
                window.location.href = "/";
            } else if (error.response.status === 403) {
                alert("You do not have permission to access this resource.");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);