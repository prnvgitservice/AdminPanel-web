const express = require('express');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts
    const [usersCount, providersCount, servicesCount, subscriptionTotal] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      Provider.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'active' }),
      Provider.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$subscription.amountPaid' } } }
      ])
    ]);

    // Get recent bookings (mock data for now)
    const recentBookings = [
      {
        id: 1,
        name: 'MOKILA SHANKER YADHAV',
        date: '05 Aug 2024',
        service: 'Hardware Service',
        status: 'Pending',
        price: '₹0'
      },
      {
        id: 2,
        name: 'Surla Raju',
        date: '05 Aug 2024',
        service: 'AC Service',
        status: 'Pending',
        price: '₹0'
      },
      {
        id: 3,
        name: 'INDRA RAM',
        date: '03 Aug 2024',
        service: 'Repair Service',
        status: 'Cancelled by User',
        price: '₹0'
      },
      {
        id: 4,
        name: 'Pujari Chandan',
        date: '02 Aug 2024',
        service: 'Plumbing Service',
        status: 'Pending',
        price: '₹0'
      },
      {
        id: 5,
        name: 'JAMES GANDHALA',
        date: '10 Jul 2024',
        service: 'Electrical Service',
        status: 'Pending',
        price: '₹0'
      }
    ];

    res.json({
      success: true,
      data: {
        stats: {
          users: usersCount,
          providers: providersCount,
          services: servicesCount,
          subscription: subscriptionTotal[0]?.total || 0
        },
        recentBookings
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get dashboard analytics
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    // Get monthly user registrations
    const userRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Get service categories distribution
    const serviceCategories = await Service.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get provider subscription distribution
    const subscriptionDistribution = await Provider.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userRegistrations,
        serviceCategories,
        subscriptionDistribution
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;