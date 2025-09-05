import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentCategories,
} from '../controllers/departmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/categories', getDepartmentCategories);

// Protected routes
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartmentById);

// Admin routes
router.post('/', protect, authorize('admin'), createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

export default router;