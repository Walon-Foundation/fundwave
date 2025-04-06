import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'https://fundwave-vert.vercel.app/api/',
    withCredentials: true,
});


