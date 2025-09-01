//generate payment code interface
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



//generate account interface
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


//confirm payment interface
export interface ConfirmPayment {
  apiVersion: string;
  event: Event;
  object: Object;
  data: Data;
}

interface Data {
  amount: Amount;
  authorizedPhoneNumber: string;
  authorizedProviders: null;
  createTime: string;
  customer: null;
  enable: boolean;
  expireTime: string;
  financialAccountId: string;
  id: string;
  metadata: null;
  mode: string;
  name: string;
  ownershipGraph: null;
  processedPaymentData: null;
  recurrentPaymentTarget: RecurrentPaymentTarget;
  reference: null;
  status: string;
  updateTime: string;
  ussdCode: string;
}

interface RecurrentPaymentTarget {
  expectedPaymentCount: number;
  expectedPaymentTotal: any;
}

interface Amount {
  currency: string;
  value: number;
}

interface Object {
  id: string;
  type: string;
}

interface Event {
  id: string;
  name: string;
  timestamp: string;
}


// cashout interface

export interface Cashout {
  success: boolean;
  messages: string[];
  result: Result;
}

interface Result {
  id: string;
  status: string;
  amount: Amount;
  source: Source;
  destination: Destination;
  fees: Fee[];
  failureDetail: FailureDetail;
  createTime: string;
  updateTime: string;
  ownershipGraph: OwnershipGraph;
  metadata: Metadata;
}

interface OwnershipGraph {
  owner: Owner2;
}

interface Owner2 {
  id: string;
  type: string;
  metadata: Metadata;
  owner: Owner;
}

interface Owner {
  id: string;
  type: string;
  metadata: Metadata;
  owner: Metadata;
}

interface FailureDetail {
  code: string;
  message: string;
}

interface Fee {
  code: string;
  amount: Amount;
  metadata: Metadata;
}

interface Metadata {
}

interface Destination {
  type: string;
  providerId: string;
  accountNumber: string;
  transactionReference: string;
}

interface Source {
  financialAccountId: string;
  transactionReference: string;
}

interface Amount {
  currency: string;
  value: number;
}

