import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'https://fundwavesl.vercel.app/api/',
    withCredentials: true,
});


