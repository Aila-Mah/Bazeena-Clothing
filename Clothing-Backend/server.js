require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoutes = require('./routes/auth');
//const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
//app.use('/api/products', productRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));