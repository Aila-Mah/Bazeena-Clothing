const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateAddress, changePassword, verifyEmail  } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmail);
router.get('/profile', authMiddleware, getProfile);
router.put('/address', authMiddleware, updateAddress);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
