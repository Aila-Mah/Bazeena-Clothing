const Wishlist = require('../models/Wishlist');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('products');
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
