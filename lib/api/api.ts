import { ApiError, Campaign, CampaignDetails, CombinedUserData, CreateComment, CreatePayment,  Dashboard, Updates,} from "@/types/api"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"

export class API {
    private client:AxiosInstance

    constructor(){
        this.client = axios.create({
            baseURL:process.env.NEXT_PUBLIC_API_URL,
            withCredentials:true,
        })

        this.client.interceptors.response.use(
            (response:AxiosResponse) => response,
            (error:AxiosError) => {
                const err:ApiError = {
                    status: error.status! || 500,
                    message:(error.response?.data as any).message || error.message || "unknown api error",
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

    //update a campiagn
    async updateCampaign(){

    }

    async createCampaign(data:FormData){
        return this.client.post("/campaigns", data).then(res => res.data)
    }

    async getCampaignDetails(id:string):Promise<CampaignDetails>{
        return this.client.get(`/campaigns/${id}`).then(res => res.data.data as CampaignDetails)
    }

    //comments
    async createComment(data:CreateComment, id:string){
        return this.client.post(`/campaigns/${id}/comments`, data).then(res => res.data.data)
    }

    //edit commit
    async updateComment(data:CreateComment, id:string, commentId:string){
        return this.client.patch(`/campaigns/${id}/comments/${commentId}`, data).then(res => res.data.data)
    }

    //delete coment 
    async deleteComment(id:string, commentId:string){
        return this.client.delete(`/campaigns/${id}/comments/${commentId}`).then(res => res.data)
    }

    //updates
    async createUpdate(data:any, id:string){
        return this.client.post(`/campaigns/${id}/updates`, data).then(res => res.data.data)
    }

    //getting all updates for a given campaign
    async getUpdate(id:string):Promise<Updates[] | undefined>{
        return this.client.get(`/campaigns/${id}/updates`).then(res => res.data.data as Updates[])
    }

    //edit an update
    async updateUpdate(data:any, id:string, updateId:string){
        return this.client.patch(`/campaigns/${id}/updates/${updateId}`, data).then(res => res.data.data)
    }

    //delete update
    async deleteUpdate(id:string, upatedId:string){
        return this.client.delete(`/campaigns/${id}/updates/${upatedId}`).then(res => res.status)
    }

    //payment
    async createPayment(data:CreatePayment, id:string){
        return this.client.post(`/campaigns/${id}/payments`, data).then(res => res.data.data)
    }

    //dashboard
    async getUserDashboard():Promise<Dashboard>{
        return this.client.get('/dashboard').then(res => res.data.data as Dashboard)
    }

    //user profile
    async getProfile():Promise<CombinedUserData>{
        return this.client.get('/users/profile').then(res => res.data.data as CombinedUserData )
    }

    //delete user profile
    async deleteProfile(){
        return this.client.delete("/users/profile").then(res => res.status)
    }

    //update user
    async updateProfile(data:any){
        return this.client.patch("/users/profile",data).then(res => res)
    }

    //kyc
    async createKYC(data:FormData){
        return this.client.patch('/users/kyc', data).then(res => res)
    }

    //withdrawal
    async makeWithdrawal(data:any, id:string){
        return this.client.post(`/campaigns/${id}/cash-out`, data).then(res => res)
    }
} 

export const api = new API()

