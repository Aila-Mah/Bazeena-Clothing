const Cart = require('../models/Cart');

// GET /api/cart/:userId → fetch user's cart with product details
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId');

    if (!cart) return res.status(200).json({ items: [] }); // Return empty cart
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/add → add product to cart or update quantity
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart with item
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new product
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/remove → remove one product from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({
        success: true,
        message: 'Item removed',
        cart,
      });
      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/clear → remove all items from cart
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PATCH /api/cart/change → increment or decrement quantity by 1
exports.changeQuantity = async (req, res) => {
    const { userId, productId, change } = req.body; // change = +1 or -1
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });
  
      cart.items[itemIndex].quantity += change;
  
      // Auto-remove if quantity becomes 0 or less
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  