import axios from "axios"
import { nanoid } from "nanoid";
import { GenerateCode,  GenerateAccount, Cashout, GetFinancialAccount, MainResponse } from "../types/monimeTypes";

const spaceId = process.env.MONIME_SPACE_ID || "enter monime_space_id"
const token = process.env.MONIME_ACCESS_TOKEN || "enter access token from monime";


export default async function createPaymentCode(paymentName:string, name:string, amount:number, phoneNumber:string, financialAccountId:string):Promise<GenerateCode | undefined> {
  const URL = "https://api.monime.io/v1/payment-codes";

  const bodyData = {
    name: `${paymentName}`,
    mode: "recurrent",
    enable:true,
    amount: {
      currency: "SLE",
      value:(amount) * 100
    },
    duration: "1h30m",
    customer: {
      name: `${name}`,
    },
    reference:"",
    authorizedPhoneNumber:phoneNumber,
    // authorizedProviders: ["m17", "m18"],
    recurrentPaymentTarget:{
      expectedPaymentCount: 1,
      expectedPaymentTotal:{
        currency:"SLE",
        value:(amount) * 100
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
  } catch (err) {
    console.log(err)
  }
  // if (axios.isAxiosError(err)) {
  //   console.error("❌ Axios request failed");
  //   console.error("real error: ", err.response?.data)
  //   console.error("Status:", err.response?.status);
  //   console.error("Message:", err.response?.statusText);
  //   console.error("Data:", err.response?.data); // <-- API error details
	// console.error("Error: ", err.response?.data.error.details)
  // } else {
  //   console.error("❌ Unexpected error:", err);
  // }}
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



export async function campaignCashout(amount:number, financialAccountId:string, phoneNumber:string, provider:string):Promise<Cashout | undefined>{
 try{
    const URL = 'https://api.monime.io/v1/payouts'
    const providerName = provider === "orange" ? "m17": "m18"
    const body = {
      "amount":{
        "currency":"SLE",
        "value": (amount) * 100,
      },
      "source":{
        "financialAccountId":financialAccountId
      },
      "destination":{
        "type":"momo",
        "providerId":providerName,
        "phoneNumber":phoneNumber,
      },
    }

    const res = await axios.post(URL, body, {
      headers:{
        'Monime-Space-Id': `${spaceId}`,
        'Idempotency-Key': `${nanoid(24)}`,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return res.data as Cashout
 }catch(err){
  if (axios.isAxiosError(err)) {
    console.error("❌ Axios request failed");
    console.error("real error: ", err.response?.data)
    console.error("Status:", err.response?.status);
    console.error("Message:", err.response?.statusText);
    console.error("Data:", err.response?.data); // <-- API error details
	console.error("Error: ", err.response?.data.error.details)
  } else {
    console.error("❌ Unexpected error:", err);
  }}
}


export async function FinancialAccount(id:string):Promise<GetFinancialAccount | undefined>{
  try{
    const res = await axios.get(`https://api.monime.io/v1/financial-accounts/${id}`, {
    headers:{
      'Monime-Space-Id': `${spaceId}`,
      'Idempotency-Key': `${nanoid(24)}`,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  return res.data as GetFinancialAccount

  }catch(err){
    console.log(err)
  }
}

// fac-k6GeJjHSLjvobTqzhgEiWF8RjYE
export async function TransferToMainAccount(financialAccountId:string, amount:number):Promise<MainResponse | undefined>{
  try{
    const url = "https://api.monime.io/v1/internal-transfers"
    const body = {
      "amount":{
        "currency":"SLE",
        "value": amount * 100,
      },
      "sourceFinancialAccount":{
        // "id":"fac-k6G5y2PT9KhcHDTGWZiamfW4EKY"
		  "id":"fac-k6GeJjHSLjvobTqzhgEiWF8RjYE"
      },
      "destinationFinancialAccount":{
        "id":financialAccountId
      },
    }

    const res = await axios.post(url, body, {
      headers:{
        'Monime-Space-Id': `${spaceId}`,
        'Idempotency-Key': `${nanoid(24)}`,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return res.data as MainResponse
  }catch(err){
    if (axios.isAxiosError(err)) {
    console.error("❌ Axios request failed");
    console.error("real error: ", err.response?.data)
    console.error("Status:", err.response?.status);
    console.error("Message:", err.response?.statusText);
    console.error("Data:", err.response?.data); // <-- API error details
	console.error("Error: ", err.response?.data.error.details)
  } else {
    console.error("❌ Unexpected error:", err);
  }}}
