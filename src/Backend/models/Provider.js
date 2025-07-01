const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  profileImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  category: {
    type: String,
    default: ''
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  verificationDocuments: [{
    type: String,
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  bdaAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BDA',
    default: null
  },
  videoLink: {
    type: String,
    default: ''
  },
  serviceGallery: [{
    type: String
  }],
  workGallery: [{
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectReason: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  videoGallery: [{
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectReason: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['BASIC PLAN', 'PREMIUM PLAN', 'ENTERPRISE PLAN'],
      default: 'BASIC PLAN'
    },
    startDate: Date,
    endDate: Date,
    amountPaid: {
      type: Number,
      default: 0
    },
    bdaWalletAmount: {
      type: Number,
      default: 0
    },
    amountUsed: {
      type: Number,
      default: 0
    },
    amountBalance: {
      type: Number,
      default: 0
    },
    paymentType: {
      type: String,
      enum: ['Paid', 'Free'],
      default: 'Free'
    }
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
  location: {
    city: String,
    state: String,
    country: String,
    pincode: String,
    address: String
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
providerSchema.index({ email: 1 });
providerSchema.index({ mobileNumber: 1 });
providerSchema.index({ status: 1 });
providerSchema.index({ 'subscription.plan': 1 });

module.exports = mongoose.model('Provider', providerSchema);