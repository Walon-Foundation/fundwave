import { cookies } from "next/headers";
import { axiosInstance } from "./axiosInstance";
import jwt from "jsonwebtoken"

interface User{
    name:string,
    email:string,
    address:string,
    isVerfied:string,
    createdAt:Date,
    amount:number,
    phone:string,
    profile:string,
}    

export async function getUser():Promise<User>{
    let user
    const res = await axiosInstance.get("/auth/me")
    if(res.status === 200){
        user = res.data.data
    }

    return user as User
}


export async function validateUser(){
   const token = (await cookies()).get("accessToken")?.value
   if(!token){
    console.log("user is not authenticated")
    return
   }
   const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string, isKyc:boolean, roles:string}
   
   return user
} 