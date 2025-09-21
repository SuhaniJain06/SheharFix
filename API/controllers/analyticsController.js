const CivicIssue = require('../models/CivicIssue');
const WorkOrder = require('../models/WorkOrder');
const CommunityWatch = require('../models/CommunityWatch');
const User = require('../models/User');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalIssues = await CivicIssue.countDocuments();
    const totalWorkOrders = await WorkOrder.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCommunityReports = await CommunityWatch.countDocuments();

    // Recent activity (last 30 days)
    const recentIssues = await CivicIssue.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentWorkOrders = await WorkOrder.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Issues by status
    const issuesByStatus = await CivicIssue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Issues by category
    const issuesByCategory = await CivicIssue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Issues by priority
    const issuesByPriority = await CivicIssue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Work orders by status
    const workOrdersByStatus = await WorkOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Resolution rate (last 30 days)
    const resolvedIssues = await CivicIssue.countDocuments({
      status: 'resolved',
      updatedAt: { $gte: thirtyDaysAgo }
    });

    const resolutionRate = recentIssues > 0 ? (resolvedIssues / recentIssues) * 100 : 0;

    // Average resolution time
    const resolvedIssuesWithTime = await CivicIssue.find({
      status: 'resolved',
      createdAt: { $gte: thirtyDaysAgo }
    }).select('createdAt updatedAt');

    const avgResolutionTime = resolvedIssuesWithTime.length > 0 
      ? resolvedIssuesWithTime.reduce((sum, issue) => {
          const resolutionTime = issue.updatedAt - issue.createdAt;
          return sum + resolutionTime;
        }, 0) / resolvedIssuesWithTime.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Top reporters
    const topReporters = await CivicIssue.aggregate([
      { $group: { _id: '$reporter', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { name: '$user.name', email: '$user.email', issueCount: '$count' } }
    ]);

    // Monthly trends (last 12 months)
    const monthlyTrends = await CivicIssue.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: {
        totalIssues,
        totalWorkOrders,
        totalUsers,
        totalCommunityReports,
        recentIssues,
        recentWorkOrders,
        resolutionRate: Math.round(resolutionRate * 100) / 100,
        avgResolutionTime: Math.round(avgResolutionTime * 100) / 100
      },
      breakdowns: {
        issuesByStatus,
        issuesByCategory,
        issuesByPriority,
        workOrdersByStatus
      },
      insights: {
        topReporters,
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get issue analytics
const getIssueAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d', category, status } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filter = { createdAt: { $gte: startDate } };
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Daily issue trends
    const dailyTrends = await CivicIssue.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Category distribution
    const categoryDistribution = await CivicIssue.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Status distribution
    const statusDistribution = await CivicIssue.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Priority distribution
    const priorityDistribution = await CivicIssue.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Geographic distribution
    const geographicDistribution = await CivicIssue.aggregate([
      { $match: { ...filter, 'location.coordinates': { $exists: true } } },
      {
        $group: {
          _id: {
            ward: '$location.ward',
            zone: '$location.zone'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    // Resolution time analysis
    const resolutionTimeAnalysis = await CivicIssue.aggregate([
      {
        $match: {
          ...filter,
          status: 'resolved',
          createdAt: { $exists: true },
          updatedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTimeDays: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          },
          category: 1
        }
      },
      {
        $group: {
          _id: '$category',
          avgResolutionTime: { $avg: '$resolutionTimeDays' },
          minResolutionTime: { $min: '$resolutionTimeDays' },
          maxResolutionTime: { $max: '$resolutionTimeDays' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      timeframe,
      filters: { category, status },
      trends: {
        dailyTrends
      },
      distributions: {
        category: categoryDistribution,
        status: statusDistribution,
        priority: priorityDistribution,
        geographic: geographicDistribution
      },
      analysis: {
        resolutionTime: resolutionTimeAnalysis
      }
    });
  } catch (error) {
    console.error('Get issue analytics error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get work order analytics
const getWorkOrderAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Work order status distribution
    const statusDistribution = await WorkOrder.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Category distribution
    const categoryDistribution = await WorkOrder.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Budget analysis
    const budgetAnalysis = await WorkOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'budget.estimated.amount': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalEstimated: { $sum: '$budget.estimated.amount' },
          avgEstimated: { $avg: '$budget.estimated.amount' },
          totalActual: { $sum: '$budget.actual.amount' },
          avgActual: { $avg: '$budget.actual.amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Completion time analysis
    const completionTimeAnalysis = await WorkOrder.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate },
          'timeline.actual.endDate': { $exists: true },
          'timeline.actual.startDate': { $exists: true }
        }
      },
      {
        $project: {
          completionTimeDays: {
            $divide: [
              {
                $subtract: [
                  '$timeline.actual.endDate',
                  '$timeline.actual.startDate'
                ]
              },
              1000 * 60 * 60 * 24
            ]
          },
          category: 1
        }
      },
      {
        $group: {
          _id: '$category',
          avgCompletionTime: { $avg: '$completionTimeDays' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top contractors
    const topContractors = await WorkOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'assignedTo.contractor': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$assignedTo.contractor',
          totalWorkOrders: { $sum: 1 },
          completedWorkOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalBudget: { $sum: '$budget.estimated.amount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contractor'
        }
      },
      { $unwind: '$contractor' },
      {
        $project: {
          name: '$contractor.name',
          email: '$contractor.email',
          totalWorkOrders: 1,
          completedWorkOrders: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedWorkOrders', '$totalWorkOrders'] },
              100
            ]
          },
          totalBudget: 1
        }
      },
      { $sort: { totalWorkOrders: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      timeframe,
      distributions: {
        status: statusDistribution,
        category: categoryDistribution
      },
      analysis: {
        budget: budgetAnalysis[0] || {},
        completionTime: completionTimeAnalysis
      },
      contractors: topContractors
    });
  } catch (error) {
    console.error('Get work order analytics error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get geographic analytics
const getGeographicAnalytics = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    // Find issues within radius
    const nearbyIssues = await CivicIssue.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).select('title description category status priority location createdAt');

    // Geographic clustering by ward/zone
    const wardDistribution = await CivicIssue.aggregate([
      {
        $match: {
          'location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              $maxDistance: parseInt(radius)
            }
          }
        }
      },
      {
        $group: {
          _id: {
            ward: '$location.ward',
            zone: '$location.zone'
          },
          count: { $sum: 1 },
          categories: { $addToSet: '$category' },
          priorities: { $addToSet: '$priority' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Hotspots (areas with high issue density)
    const hotspots = await CivicIssue.aggregate([
      {
        $match: {
          'location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              $maxDistance: parseInt(radius)
            }
          }
        }
      },
      {
        $bucket: {
          groupBy: '$location.coordinates',
          boundaries: [0, 100, 500, 1000, 2000, 5000],
          default: '5000+',
          output: {
            count: { $sum: 1 },
            categories: { $addToSet: '$category' },
            avgPriority: { $avg: '$priority' }
          }
        }
      }
    ]);

    res.json({
      center: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius)
      },
      nearbyIssues,
      wardDistribution,
      hotspots
    });
  } catch (error) {
    console.error('Get geographic analytics error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getIssueAnalytics,
  getWorkOrderAnalytics,
  getGeographicAnalytics
};
