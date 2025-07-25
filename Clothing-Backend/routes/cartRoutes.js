const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get user's cart
router.get('/:userId', cartController.getCart);

// Add or update product in cart
router.post('/add', cartController.addToCart);

// Remove one product from cart
router.post('/remove', cartController.removeFromCart);

// Clear entire cart
router.post('/clear', cartController.clearCart);

// Change the quantity by 1
router.patch('/change', cartController.changeQuantity);

module.exports = router;
