// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample data would be loaded here - not included in the code
// as you mentioned it's understood
const products = require('./db.json');

app.use(express.json());

// GET all products with pagination and search
app.get('/api/products', (req, res) => {
  // Get query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Filter products based on search term
  let filteredProducts = products;
  
  if (search) {
    filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.variants.some(variant => 
        variant.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Prepare pagination metadata
  const pagination = {
    total: filteredProducts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProducts.length / limit)
  };
  
  // Get products for current page
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Send response
  res.json({
    success: true,
    pagination,
    data: paginatedProducts
  });
});

// GET a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.query.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});