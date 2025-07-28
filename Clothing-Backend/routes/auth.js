const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateAddress, changePassword  } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', authMiddleware, getProfile);

router.put('/address', authMiddleware, updateAddress);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
