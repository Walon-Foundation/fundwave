import jwt from "jsonwebtoken"
import { User } from "../types/types"

export const generateAccessToken = (user:User) => {
    return jwt.sign({id:user._id, username:user.username, roles:user.roles, iscampaign:user.isCampaign}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15m'})
}

export const verifyAccessToken = (token:string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
}

export const generateSessionToken = (id:string) => {
    return jwt.sign({id}, process.env.SESSION_TOKEN_SECRET!, {expiresIn: '15m'})
}

export const verifySessionToken = (token:string) => {
    return jwt.verify(token, process.env.SESSION_TOKEN_SECRET!)
}

export const generateUserToken = (user:User) => {
    return jwt.sign({
                profilePicture:user.profilePicture,
                _id:user._id,
                username:user.username, 
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                phoneNumber: user.phoneNumber,
                qualification:user.qualification,
                DOE:user.DOB,
                address:user.address,
                roles:user.roles,
                isCampaign:user.isCampaign,
                createdAt:user.createdAt
            },process.env.USER_TOKEN_SECRET!,{ expiresIn:"1d" })
}

export const verifyUserToken = (token:string) => {
    return jwt.verify(token, process.env.USER_TOKEN_SECRET!)
}

export const generateVerificationToken = (id:string) => {
    return jwt.sign({id}, process.env.VERIFICAION_TOKEN_SECRET!, {expiresIn: '15m'})
}

export const verifyVerificationToken = (token:string) => {
    return jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET!)
}