import axios from "axios"
import { nanoid } from "nanoid";
import { GenerateCode } from "../types/monimeTypes";

const spaceId = process.env.MONIME_SPACE_ID || "enter monime_space_id"
const token = process.env.TOKEN || "enter access token from monime";


export default async function createPaymentCode(paymentName:string, name:string, amount:string, phoneNumber:string):Promise<GenerateCode | undefined> {
  const postUrl = "https://api.monime.io/payment-codes";

  const bodyData = {
    name: `${paymentName}`,
    mode: "recurrent",
    isActive: true,
    amount: {
      currency: "SLE",
      value: Number(amount) * 100
    },
    duration: "1h30m",
    customerTarget: {
      name: `${name}`,
      reference: "0123456789",
      payingPhoneNumber: `${phoneNumber}`
    },
    allowedProviders: ["m17", "m18"],
    metadata: {}
  };

  try {
    const response = await axios.post(postUrl, bodyData, {
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