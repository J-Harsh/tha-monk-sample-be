// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Load data from db.json
const products = require('./db.json');

app.use(express.json());

// Single route that handles both listing all products and searching
app.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  
  // Filter products based on search term (if provided)
  let results = products;
  
  if (search) {
    results = products.filter(product => 
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Pagination metadata
  const pagination = {
    total: results.length,
    page,
    pages: Math.ceil(results.length / limit)
  };
  
  // Get products for current page
  const paginatedResults = results.slice(startIndex, endIndex);
  
  // Send response
  res.json({
    pagination,
    products: paginatedResults
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});