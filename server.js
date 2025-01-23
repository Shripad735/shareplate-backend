require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const foodListingRoutes = require('./routes/foodListing');
const reservationRoutes = require('./routes/reservation');
const statsRoutes = require('./routes/stats');

const app = express();

// Connect to MongoDB
connectDB();

// Configure AWS SDK with Cloudflare R2 credentials
const s3 = new AWS.S3({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
  signatureVersion: 'v4',
});

// CORS Configuration
const allowedOrigins = [
  'https://shareplate-frontend.vercel.app', // Your deployed frontend URL
  'http://localhost:3000', // For local development
];

// Middleware to handle CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Handle OPTIONS requests (preflight)
app.options('*', (req, res) => {
  res.sendStatus(204); // No content for preflight requests
});

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food-listings', foodListingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/stats', statsRoutes);

// Proxy endpoint for uploading images to Cloudflare R2
app.post('/api/upload-image', async (req, res) => {
  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const fileName = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.jpeg`;

    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    const data = await s3.upload(params).promise();
    const publicUrl = `https://pub-60eb5b9765b0491495b21d137344ee04.r2.dev/${fileName}`;
    res.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});