import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
// import  { serialize } from "cookie"

export async function POST(){
    try{
        const response = apiResponse("logout success", 200, null)

       response.cookies.delete("accessToken")

        return response
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}