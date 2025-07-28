const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');

// Create order
router.post('/', authenticate, orderController.createOrder);

// Get logged-in user's orders
router.get('/my', authenticate, orderController.getMyOrders);

// Get order by ID (admin or owner)
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router;
