import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  addReportComment,
  getNearbyReports,
  getReportStats,
  subscribeToReport,
  unsubscribeFromReport,
  getSubscriptionStatus,
} from '../controllers/reportController';
import { protect, authorize } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// Protected routes
router.post('/', protect, upload.array('images', 5), createReport);
router.get('/', protect, getReports);
router.get('/near', protect, getNearbyReports);
router.get('/stats', protect, authorize('admin', 'department_staff'), getReportStats);
router.get('/:id/subscription-status', protect, getSubscriptionStatus);
router.post('/:id/subscribe', protect, subscribeToReport);
router.post('/:id/unsubscribe', protect, unsubscribeFromReport);
router.get('/:id', protect, getReportById);
router.put('/:id/status', protect, authorize('admin', 'department_staff'), updateReportStatus);
router.post('/:id/comments', protect, addReportComment);

export default router;