export default function Loading() {
  return null
}



const url = 'https://api.monime.io/v1/payment-codes';
const options = {
  method: 'POST',
  headers: {
    'Idempotency-Key': '<idempotency-key>',
    'Monime-Space-Id': '<monime-space-id>',
    Authorization: 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: '{"mode":"one_time","name":"Home EDSA Meter Top-up","enable":true,"amount":{"currency":"<string>","value":123},"duration":"1h30m","customer":{"name":"Musa Kamara"},"reference":"<string>","authorizedProviders":["m17"],"authorizedPhoneNumber":"<string>","recurrentPaymentTarget":{"expectedPaymentCount":10,"expectedPaymentTotal":{"currency":"<string>","value":123}},"financialAccountId":"<string>","metadata":{}}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
