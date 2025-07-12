let products = require('../data/productsData');

exports.getAllProducts = (req, res) => {
  res.json(products);
};

exports.getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

exports.createProduct = (req, res) => {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0; 
    const newProduct = {
      id: maxId + 1,
      ...req.body
    }; 
    products.push(newProduct); 
    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });
  };
  
exports.updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json({
        message: 'Product updated successfully',
        product: products[index]
      });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);  
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete) {
      products = products.filter(p => p.id !== id);
      res.json({
        message: 'Product deleted successfully',
        product: productToDelete
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  };
  