import axios from "axios";

const CINETPAY_API = "https://api-checkout.cinetpay.com/v2/payment";

export async function createCinetPayPayment(amount, currency = "XAF", description = "Kalyptia dataset") {
  try {
    const response = await axios.post(CINETPAY_API, {
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: Date.now().toString(),
      amount,
      currency,
      description,
      notify_url: process.env.CINETPAY_NOTIFY_URL || "http://localhost:5000/api/payments/cinetpay/callback",
      return_url: process.env.CINETPAY_RETURN_URL || "http://localhost:3000/cinetpay/success",
      channels: "MOBILE_MONEY",
      lang: "fr",
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
}
