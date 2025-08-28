import API from "./axios";

// Paiements
export const payWithStripe = (data) => API.post("/payments/stripe", data);
export const payWithPayPal = (data) => API.post("/payments/paypal", data);
export const payWithCinetPay = (data) => API.post("/payments/cinetpay", data);
