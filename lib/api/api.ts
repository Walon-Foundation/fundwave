import { ApiError, Campaign, CampaignDetails, CreateComment, CreatePayment,  Dashboard, Donation, UserProfile } from "@/types/api"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"

export class API {
    private client:AxiosInstance

    constructor(){
        this.client = axios.create({
            baseURL:process.env.NEXT_PUBLIC_API_URL,
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })

        this.client.interceptors.response.use(
            (response:AxiosResponse) => response,
            (error:AxiosError) => {
                const err:ApiError = {
                    status: error.status! || 500,
                    message:(error.response?.data as any).message || error.message || "unknown apu error",
                    details:(error.response?.data as any).detials
                }
                return Promise.reject(err)
            },
        )
    }

    //campaigns
    async getCampaigns():Promise<Campaign[]>{
        return this.client.get('/campaigns').then(res => res.data.data as Campaign[])
    }

    async createCampaign(data:FormData){
        return this.client.post("/campaigns", data).then(res => res)
    }

    async getCampaignDetails(id:string):Promise<CampaignDetails>{
        return this.client.get(`campaigns/${id}`).then(res => res.data as CampaignDetails)
    }

    //comments
    async createComment(data:CreateComment, id:string){
        return this.client.post(`/campaigns/${id}/comments`, data).then(res => res)
    }

    //updates
    async createUpdate(data:FormData, id:string){
        return this.client.post(`/campaigns/${id}/updates`, data).then(res => res)
    }

    //payment
    async createPayment(data:CreatePayment, id:string){
        return this.client.post(`/campaigns/${id}/payments`)
    }

    //dashboard
    async getUserDashboard():Promise<Dashboard>{
        return this.client.get('/dashboard').then(res => res.data as Dashboard)
    }

    //user profile
    async getProfile():Promise<UserProfile>{
        return this.client.get('users/profile').then(res => res.data as UserProfile)
    }

    async getDonation():Promise<Donation>{
        return this.client.get('users/donations').then(res => res.data as Donation)
    }

    async userCampaign():Promise<Campaign>{
        return this.client.get('users/activity').then(res => res.data as Campaign)
    }

    //kyc
    async createKYC(data:FormData){
        return this.client.post('/users/kyc', data).then(res => res)
    }
} 

export const api = new API()

