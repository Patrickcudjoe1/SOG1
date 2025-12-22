import { paystack } from "../config/paystack.js";
import db, { store } from "../db/index.js";
import { products } from "../models/productModel.js";
import { eq } from "drizzle-orm";
import { sendOrderEmails } from "../utils/email.js";

export const initializePayment = async (req, res) => {
  try {
    const { items, email, address, totalAmount } = req.body;

    if (!email || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const userId = req.user?._id ?? null;
    const itemsValue = Array.isArray(items) ? items : [];
    const totalAmountValue = Number(totalAmount) || 0;

    const enhancedItems = [];

    for (const it of itemsValue) {
      const newItem = { ...it };

      try {
       
        const [prod] = await db
          .select()
          .from(products)
          .where(eq(products.id, newItem.id))
          .limit(1);

        if (prod && prod.image) {
        
          newItem.image = Array.isArray(prod.image) ? prod.image : [prod.image];
        }
      } catch (e) {
        console.warn("Could not enrich order item with image", e?.message || e);
      }

      enhancedItems.push(newItem);
    }
    const [order] = await db
      .insert(store)
      .values({
        user_id: userId,
        items: enhancedItems,
        email,
        address,
        total_amount: totalAmountValue,
        status: "pending",
      })
      .returning();

    const rawFrontend =
      process.env.FRONTEND_URL ||
      process.env.VITE_FRONTEND_URL ||
      "https://ecommerce-shop-lovat-pi.vercel.app";

    const frontendURL = rawFrontend
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0]
      .replace(/\/$/, "");

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: Math.round(totalAmount * 100),
      metadata: { orderId: order.id },
      callback_url: `${frontendURL}/payment-result`,
    });

    await db
      .update(store)
      .set({ reference: response.data.data.reference })
      .where(eq(store.id, order.id));

    return res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      orderId: order.id,
    });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res
      .status(500)
      .json({ success: false, message: "Payment init failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const reference = req.query.reference || req.query.trxref;

  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Missing transaction reference" });
  }

  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    const paymentData = response.data.data;

    const [order] = await db
      .select()
      .from(store)
      .where(eq(store.reference, reference))
      .limit(1);

    if (paymentData.status === "success" && order) {
      if (order.status !== "paid") {
        await db
          .update(store)
          .set({ status: "paid", paid_at: new Date() })
          .where(eq(store.reference, reference));

        const [updatedOrder] = await db
          .select()
          .from(store)
          .where(eq(store.reference, reference))
          .limit(1);

        console.log("Sending emails from verifyPayment...");
        try {
          await sendOrderEmails(updatedOrder);
        } catch (e) {
          console.warn("Failed to send order emails:", e?.message || e);
        }
      }
    }

    const result = {
      ...paymentData,
      orderId: order?.id || null,
    };
    const accept = req.headers.accept || "";
    if (accept.includes("application/json")) {
      return res.json({ success: true, data: result });
    }

    const rawFrontend =
      process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL;
    const frontend = rawFrontend
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0];
    const baseFrontend = (
      frontend || "https://ecommerce-shop-lovat-pi.vercel.app"
    ).replace(/\/$/, "");

    const redirectUrl = `${baseFrontend}/payment-result?reference=${encodeURIComponent(
      reference
    )}&orderId=${order?.id || ""}&status=${encodeURIComponent(
      paymentData.status
    )}`;

    console.log("Paystack verify redirect ->", redirectUrl);

    return res.status(200).send(`
      <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
      <p>If you are not redirected, <a href="${redirectUrl}">click here</a>.</p>
    `);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};

export const paystackWebhook = async (req, res) => {
  console.log("Webhook Payload:", JSON.stringify(req.body, null, 2));

  const crypto = await import("crypto");
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const signature = req.headers["x-paystack-signature"];
  if (hash !== signature) {
    console.error("Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const ref = event.data.reference;
    console.log(`Payment Successful. Reference: ${ref}`);

    try {
  
      const [order] = await db
        .select()
        .from(store)
        .where(eq(store.reference, ref))
        .limit(1);

      if (!order) {
        console.warn(`Order not found for reference: ${ref}`);
        return res.json({ received: true });
      }


      if (order.status !== "paid") {
        await db
          .update(store)
          .set({ status: "paid", paid_at: new Date() })
          .where(eq(store.reference, ref));

        const [updatedOrder] = await db
          .select()
          .from(store)
          .where(eq(store.reference, ref))
          .limit(1);

        console.log("Sending emails from webhook...");
        try {
          await sendOrderEmails(updatedOrder);
          console.log("Webhook: Order emails sent successfully");
        } catch (e) {
          console.error(
            "Webhook: Failed to send order emails",
            e?.message || e
          );
        }
      } else {
        console.log("ℹOrder already marked as paid, skipping email");
      }
    } catch (e) {
      console.error("Webhook error:", e?.message || e);
    }
  }

  res.json({ received: true });
};
