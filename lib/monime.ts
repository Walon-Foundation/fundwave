import axios from "axios"
import { nanoid } from "nanoid";
import { GenerateCode,  GenerateAccount } from "../types/monimeTypes";

const spaceId = process.env.MONIME_SPACE_ID || "enter monime_space_id"
const token = process.env.TOKEN || "enter access token from monime";


export default async function createPaymentCode(paymentName:string, name:string, amount:string, phoneNumber:string, financialAccountId:string):Promise<GenerateCode | undefined> {
  const URL = "https://api.monime.io/v1/payment-codes";

  const bodyData = {
    name: `${paymentName}`,
    mode: "recurrent",
    enable:true,
    amount: {
      currency: "SLE",
      value: Number(amount) * 100
    },
    duration: "1h30m",
    customer: {
      name: `${name}`,
    },
    reference:"",
    authorizePhoneNumber:phoneNumber,
    authorizedProviders: ["m17", "m18"],
    recurrentPaymentTarget:{
      expectedPaymentCount: Number(amount),
      expectedPaymentTotal:{
        currency:"SLE",
        value:Number(amount)
      }
    },
    financialAccountId,
    metadata: {}
  };

  try {
    const response = await axios.post(URL, bodyData, {
        headers: {
          'Monime-Space-Id': `${spaceId}`,
          'Idempotency-Key': `${nanoid(24)}`,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    })
    return response.data as GenerateCode
  } catch (error) {
    console.error("Error creating payment code:", error);
  }
}




export async function createAccount( name:string ):Promise<GenerateAccount | undefined>{
  try{
    const URL = 'https://api.monime.io/v1/financial-accounts'
    const body = {
      name,
      currency:"SLE",
      reference:"",
      description:"",
      metadata:{
      }
    }

    const res = await axios.post(URL,body,{
      headers: {
        'Monime-Space-Id': `${spaceId}`,
        'Idempotency-Key': `${nanoid(24)}`,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return res.data as GenerateAccount
  }catch(err){
    console.log(err)
  }
}

