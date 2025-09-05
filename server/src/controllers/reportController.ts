import { Request, Response } from 'express';
import Report from '../models/Report';
import Department from '../models/Department';
import User from '../models/User';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req: Request, res: Response) => {
  try {
    const { title, description, location, category } = req.body;

    // Get image files from multer
    const images = req.files as Express.Multer.File[];
    const imageUrls = images ? images.map(file => `/uploads/${file.filename}`) : [];

    // Create report
    const report = await Report.create({
      title,
      description,
      location,
      category,
      priority: req.body.priority || 'medium',
      images: imageUrls,
      reportedBy: req.user._id,
    });

    // Auto-assign to department based on category
    const department = await Department.findOne({
      categories: { $in: [category] },
    });

    if (department) {
      report.assignedDepartment = department.name;
      await report.save();
    }

    res.status(201).json(report);
  } catch (error: any) {
    console.error('Create report error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    // Filter options
    const filter: any = {};

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by category if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by priority if provided
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Filter by department for department staff
    if (req.user.role === 'department_staff') {
      filter.assignedDepartment = req.user.department;
    }

    // Filter by user for citizens
    if (req.user.role === 'citizen') {
      filter.reportedBy = req.user._id;
    }

    // Get total count
    const count = await Report.countDocuments(filter);

    // Get reports with pagination
    const reports = await Report.find(filter)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      reports,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has access to this report
    if (
      req.user.role === 'citizen' &&
      report.reportedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to access this report' });
    }

    res.json(report);
  } catch (error: any) {
    console.error('Get report error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private/Admin/Department
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update status
    if (
      req.user.role === 'department_staff' &&
      report.assignedDepartment !== req.user.department
    ) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    report.status = status;

    // If status is in_progress and not assigned yet, assign to current user
    if (status === 'in_progress' && !report.assignedTo) {
      report.assignedTo = req.user._id;
    }

    const updatedReport = await report.save();

    // Notify subscribers
    const humanStatus = status.replace('_', ' ');
    await notifyReportSubscribers(
      String(updatedReport._id),
      'Report status updated',
      `Your subscribed report "${updatedReport.title}" is now ${humanStatus}.`
    );

    res.json(updatedReport);
  } catch (error: any) {
    console.error('Update report status error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Add comment to report
// @route   POST /api/reports/:id/comments
// @access  Private
export const addReportComment = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const comment = {
      text,
      user: req.user._id,
      createdAt: new Date(),
    };

    report.comments.push(comment);
    await report.save();

    const updatedReport = await Report.findById(req.params.id)
      .populate('comments.user', 'name email');

    res.status(201).json(updatedReport);
  } catch (error: any) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Subscribe to report updates
// @route   POST /api/reports/:id/subscribe
// @access  Private
export const subscribeToReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const userId = req.user._id;
    report.subscribers = report.subscribers || [];

    const alreadySubscribed = report.subscribers.some(
      (subscriberId: any) => subscriberId.toString() === userId.toString()
    );

    if (!alreadySubscribed) {
      report.subscribers.push(userId);
      await report.save();
    }

    res.status(200).json({ message: 'Subscribed to report updates' });
  } catch (error: any) {
    console.error('Subscribe to report error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Unsubscribe from report updates
// @route   POST /api/reports/:id/unsubscribe
// @access  Private
export const unsubscribeFromReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const userId = req.user._id.toString();
    report.subscribers = (report.subscribers || []).filter(
      (subscriberId: any) => subscriberId.toString() !== userId
    );
    await report.save();

    res.status(200).json({ message: 'Unsubscribed from report updates' });
  } catch (error: any) {
    console.error('Unsubscribe from report error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Helper: notify subscribers (stub)
const notifyReportSubscribers = async (reportId: string, title: string, body: string) => {
  try {
    const report = await Report.findById(reportId).populate('subscribers', 'pushToken');
    if (!report || !report.subscribers) return;

    const tokens = (report.subscribers as any[])
      .map((u: any) => u.pushToken)
      .filter(Boolean);

    // In production, send to Expo push API here
    if (tokens.length > 0) {
      console.log('Would send notification to tokens:', tokens, title, body);
    }
  } catch (e) {
    console.error('Notify subscribers error:', e);
  }
};

// @desc    Get reports near a location
// @route   GET /api/reports/near
// @access  Private
export const getNearbyReports = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const reports = await Report.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(maxDistance),
        },
      },
    })
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error: any) {
    console.error('Get nearby reports error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get report statistics
// @route   GET /api/reports/stats
// @access  Private/Admin
export const getReportStats = async (req: Request, res: Response) => {
  try {
    // Filter by department for department staff
    const departmentFilter = req.user.role === 'department_staff' 
      ? { assignedDepartment: req.user.department }
      : {};

    // Count by status
    const statusStats = await Report.aggregate([
      { $match: departmentFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Count by category
    const categoryStats = await Report.aggregate([
      { $match: departmentFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Count by priority
    const priorityStats = await Report.aggregate([
      { $match: departmentFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Reports per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyReports = await Report.aggregate([
      { 
        $match: { 
          ...departmentFilter,
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      statusStats,
      categoryStats,
      priorityStats,
      dailyReports,
    });
  } catch (error: any) {
    console.error('Get report stats error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get subscription status for current user on a report
// @route   GET /api/reports/:id/subscription-status
// @access  Private
export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const userId = req.user._id.toString();
    const isSubscribed = (report.subscribers || []).some(
      (subscriberId: any) => subscriberId.toString() === userId
    );

    res.json({ isSubscribed });
  } catch (error: any) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};