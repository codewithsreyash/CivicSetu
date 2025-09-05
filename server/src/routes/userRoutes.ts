import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  savePushToken,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/push-token', protect, savePushToken);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);

export default router;