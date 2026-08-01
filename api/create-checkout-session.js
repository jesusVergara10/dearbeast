const Stripe = require("stripe");

// PLACEHOLDER product data — swap for the real product/price once defined.
const PRODUCT_NAME = "Lorem Ipsum Dolor";
const UNIT_AMOUNT_CENTS = 4999; // $49.99
const CURRENCY = "usd";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500).json({
      error:
        "Stripe is not configured yet. Add STRIPE_SECRET_KEY in the Vercel project settings.",
    });
    return;
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const quantity = Math.max(
      1,
      parseInt((req.body && req.body.quantity) || 1, 10)
    );

    const origin =
      req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: { name: PRODUCT_NAME },
            unit_amount: UNIT_AMOUNT_CENTS,
          },
          quantity,
        },
      ],
      shipping_address_collection: { allowed_countries: ["US", "MX"] },
      success_url: `${origin}/product.html?checkout=success`,
      cancel_url: `${origin}/product.html?checkout=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: err.message });
  }
};
