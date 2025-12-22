import db, { store } from '../db/index.js';
import { eq } from 'drizzle-orm';

export const getOrdersByEmail = async (req, res) => {
  try {
    const email = (req.query.email || '').trim();
    if (!email) return res.status(400).json({ success: false, message: 'Missing email' });

    const orders = await db.select().from(store).where(eq(store.email, email));
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error('getOrdersByEmail error', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.select().from(store);
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error('getAllOrders error', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById= async (req, res) => {
  try {
    const orderId = req.query.orderId || req.query.id;
    if (!orderId ) return res.status(400).json({ success: false, message: 'Missing orderId or email' });

    const [order] = await db.select().from(store).where(eq(store.id, Number(orderId))).limit(1);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });


    return res.json({ success: true, data: order });
  } catch (err) {
    console.error('getOrderByIdAndEmail error', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export default {
  getOrdersByEmail,
  getAllOrders,
  getOrderById,
};
