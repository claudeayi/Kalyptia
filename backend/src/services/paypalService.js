import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // "sandbox" ou "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export async function createPayPalPayment(amount, currency = "USD") {
  return new Promise((resolve, reject) => {
    const payment = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: process.env.PAYPAL_RETURN_URL || "http://localhost:3000/success",
        cancel_url: process.env.PAYPAL_CANCEL_URL || "http://localhost:3000/cancel",
      },
      transactions: [
        {
          amount: {
            total: amount.toFixed(2),
            currency,
          },
          description: "Kalyptia dataset purchase",
        },
      ],
    };

    paypal.payment.create(payment, (error, payment) => {
      if (error) reject(error);
      else resolve(payment);
    });
  });
}
