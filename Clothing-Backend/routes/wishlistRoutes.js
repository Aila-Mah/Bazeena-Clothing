const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Get wishlist by userId
router.get('/:userId', wishlistController.getWishlist);

// Add product to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove product from wishlist
router.post('/remove', wishlistController.removeFromWishlist);

module.exports = router;
