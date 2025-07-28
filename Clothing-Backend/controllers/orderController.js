const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided.' });
    }

    const newOrder = new Order({
      userId: req.user.userId,        // your middleware sets decoded token in req.user
      items,
      totalAmount,
      shippingAddress
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// Get orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get single order by ID (either admin or the owner)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Allow if admin or owner
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};