export interface CreatePaymentCode {
  success: boolean;
  messages: string[];
  result: Result;
}

interface Result {
  id: string;
  name: string;
  mode: string;
  isActive: boolean;
  status: string;
  ussdCode: string;
  amount: Amount;
  customerTarget: CustomerTarget;
  financialTarget: FinancialTarget;
  allowedProviders: string[];
  progress: Progress;
  financialAccountId: string;
  expireTime: string;
  createTime: string;
  metadata: null;
}

interface Progress {
  isCompleted: boolean;
  totalPaymentCount: number;
  totalPaymentSum: Amount;
}

interface FinancialTarget {
  expectedPaymentCount: number;
  expectedPaymentSum: Amount;
}

interface CustomerTarget {
  name: string;
  reference: string;
  payingPhoneNumber: string;
}

interface Amount {
  currency: string;
  value: number;
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