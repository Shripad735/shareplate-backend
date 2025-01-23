require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk'); // Import AWS SDK for Cloudflare R2
const connectDB = require('./db'); // Ensure you have a db.js file for MongoDB connection
const authRoutes = require('./routes/auth'); // Your authentication routes
const foodListingRoutes = require('./routes/foodListing'); // Your food listing routes
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
  // s3ForcePathStyle: true, // This is important for R2 compatibility
});

// CORS Configuration
const allowedOrigins = [
  'https://shareplate-frontend.vercel.app', // Your deployed frontend URL
  'http://localhost:3000', // For local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  })
);

// Handle OPTIONS requests (preflight)
app.options('*', cors()); // Enable preflight requests for all routes

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload limit for image uploads
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food-listings', foodListingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/stats', statsRoutes);

// Proxy endpoint for uploading images to Cloudflare R2
app.post('/api/upload-image', async (req, res) => {
  const { file } = req.body; // Base64-encoded image file
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Generate a unique file name
    const fileName = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.jpeg`;

    // Upload to Cloudflare R2
    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg', // Adjust based on the file type
      ACL: 'public-read', // Make the file publicly accessible
    };

    const data = await s3.upload(params).promise();

    // Construct the public URL
    const publicUrl = `https://pub-60eb5b9765b0491495b21d137344ee04.r2.dev/${fileName}`;

    res.json({ imageUrl: publicUrl }); // Return the public URL of the uploaded file
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