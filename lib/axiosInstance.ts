import axios from "axios"

const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api/" : "https://fundwavesl.vercel.app/api/"

export const axiosInstance = axios.create({
    baseURL,
});

