import React,{ createContext,useState } from "react";
import axios from "axios";

interface AuthProp {
    login:(username:string,password:string)=>Promise<void>
    user:User[]
    signup :(fullname:string, address:string, country:string, username:string,password:string) => Promise<void>
}

interface User {
    fullname:string,
    email:string,
    country:string,

}
const AuthContext = createContext<AuthProp | undefined >(undefined)

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User[]>([])

    const login = async(username:string,password:string) => {
        try{
            const userData = {
                username,
                password
            }
            const res = await axios.post('api/users/login',userData)
            console.log(res.data)
            setUser(user.concat(res.data.user))
        }catch(error:unknown){
            console.log(error)
        }
    }

    const signup = async(fullname:string, address:string, country:string, username:string,password:string) => {
        try{
            const userData = {
                fullname,
                username,
                password,
                country,
                address
            }
            const res = await axios.post('api/users/signup',userData)
            console.log(res.data)
        }catch(error:unknown){
            console.log(error)
        }
    }
    return(
        <AuthContext.Provider value={{
            login,
            user,
            signup
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext