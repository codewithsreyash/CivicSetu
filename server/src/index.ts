import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import config from './config/config';

// Import routes
import userRoutes from './routes/userRoutes';
import reportRoutes from './routes/reportRoutes';
import departmentRoutes from './routes/departmentRoutes';

// Import middleware
import errorHandler from './middleware/error';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);

// Health check route
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler middleware (should be after all routes)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });