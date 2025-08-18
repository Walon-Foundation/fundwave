export interface GenerateCode {
  success: boolean;
  messages: any[];
  result: {
    id: string;
    mode: 'one_time' | string; // Assuming other modes might exist
    status: string;
    name: string;
    amount: {
      currency: string;
      value: number;
    };
    enable: boolean;
    expireTime: string; // ISO format date string
    customer: {
      name: string;
    };
    ussdCode: string;
    reference: string;
    authorizedProviders: string[];
    authorizedPhoneNumber: string;
    recurrentPaymentTarget: {
      expectedPaymentCount: number;
      expectedPaymentTotal: {
        currency: string;
        value: number;
      };
    };
    financialAccountId: string;
    processedPaymentData: {
      amount: {
        currency: string;
        value: number;
      };
      orderId: string;
      paymentId: string;
      orderNumber: string;
      channelData: {
        providerId: string;
        accountId: string;
        reference: string;
      };
      financialTransactionReference: string;
      metadata: Record<string, unknown>;
    };
    createTime: string;
    updateTime: string; 
    ownershipGraph: {
      owner: {
        id: string;
        type: string;
        metadata: Record<string, unknown>;
        owner?: {
          id: string;
          type: string;
          metadata: any;
          owner?: any;
        };
      };
    };
    metadata: Record<string, unknown>;
  };
}



export interface ConfirmPayment {
  allowedProviders: string[];
  amount: Amount;
  createTime: string;
  customerTarget: CustomerTarget;
  expireTime: string;
  financialTarget: null;
  id: string;
  isActive: boolean;
  metadata: null;
  mode: string;
  name: string;
  progress: Progress;
  status: string;
  ussdCode: string;
}

interface Progress {
  isCompleted: boolean;
  totalPaymentCount: number;
  totalPaymentSum: Amount;
}

interface CustomerTarget {
  name: string;
  payingPhoneNumber: string;
  reference: string;
}

interface Amount {
  currency: string;
  value: number;
}




export interface GenerateAccount {
  success:boolean,
  message:string[],
  result:{
    id:string,
    uvan:string,
    name:string,
    currency:string,
    reference:string,
    description:string,
    balance:{
      available:{
        currency:string,
        value:number
      }
    },
    createTime:string,
    updateTime:string,
    metadata:any
  }
}