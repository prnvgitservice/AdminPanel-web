const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  shortName: {
    type: String,
    required: [true, 'Service short name is required'],
    trim: true,
    maxlength: [50, 'Short name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Service amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'AC Repair & Services',
      'Computer/Laptop Repair & Services',
      'Plumbing Services',
      'Electrical Services',
      'Deep Cleaning Services',
      'Babysitting Services',
      'Photography & Videography Services',
      'Painting Services',
      'Lift Repair & Services',
      'Dishwasher Repair & Services'
    ]
  },
  subCategory: {
    type: String,
    required: [true, 'Sub category is required']
  },
  serviceOffers: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    alt: String
  }],
  location: {
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    }
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'deleted'],
    default: 'pending'
  },
  createdBy: {
    type: String,
    enum: ['admin', 'provider'],
    default: 'provider'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ category: 1 });
serviceSchema.index({ subCategory: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ 'location.city': 1 });
serviceSchema.index({ amount: 1 });

module.exports = mongoose.model('Service', serviceSchema);