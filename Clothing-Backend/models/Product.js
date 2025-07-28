const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,        
  piece: Number,
  details: {
    topFabric: String,
    topLength: String,
    bottomFabric: String,
    bottomLength: String,
    dupattaFabric: String,
    dupattaLength: String,
    material: String
  },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Men', 'Women'], 
    required: true 
  },
  color: [String],
  images: [String],  
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
