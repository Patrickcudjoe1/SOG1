import express from 'express';
import orderController from '../controllers/ordercontroller.js';
import adminAuth from '../middleware/adminauth.js';

const router = express.Router();


router.get('/user', orderController.getOrdersByEmail);

router.get('/view', orderController.getOrderById);

router.get('/admin', adminAuth, orderController.getAllOrders);

export default router;
