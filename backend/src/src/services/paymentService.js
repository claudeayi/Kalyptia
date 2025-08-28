import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Créer un paiement avec Stripe
export async function createStripePayment(amount, currency = "usd") {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe travaille en cents
      currency,
      payment_method_types: ["card"]
    });

    return paymentIntent.client_secret; // envoyé au frontend pour finaliser le paiement
  } catch (error) {
    throw new Error(error.message);
  }
}
