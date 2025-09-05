import { Request, Response } from 'express';
import Department from '../models/Department';

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description, categories, head } = req.body;

    // Check if department already exists
    const departmentExists = await Department.findOne({ name });

    if (departmentExists) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Create department
    const department = await Department.create({
      name,
      description,
      categories,
      head,
    });

    res.status(201).json(department);
  } catch (error: any) {
    console.error('Create department error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({}).populate('head', 'name email');
    res.json(departments);
  } catch (error: any) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      'head',
      'name email'
    );

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error: any) {
    console.error('Get department error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = req.body.name || department.name;
    department.description = req.body.description || department.description;
    department.categories = req.body.categories || department.categories;
    department.head = req.body.head || department.head;

    const updatedDepartment = await department.save();

    res.json(updatedDepartment);
  } catch (error: any) {
    console.error('Update department error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();

    res.json({ message: 'Department removed' });
  } catch (error: any) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get department categories
// @route   GET /api/departments/categories
// @access  Public
export const getDepartmentCategories = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({});
    
    // Extract all unique categories
    const categories = new Set<string>();
    departments.forEach(dept => {
      dept.categories.forEach(category => categories.add(category));
    });

    res.json(Array.from(categories));
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};