const mongoose = require('mongoose');

const bdaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'BDA name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
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
  bankDetails: {
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required']
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required']
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  isOnline: {
    type: String,
    enum: ['YES', 'NO'],
    default: 'YES'
  },
  assignedProviders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    lastMonth: {
      type: Number,
      default: 0
    }
  },
  commissionRate: {
    type: Number,
    default: 10, // 10% commission
    min: 0,
    max: 100
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  location: {
    city: String,
    state: String,
    country: String,
    pincode: String
  }
}, {
  timestamps: true
});

// Indexes
bdaSchema.index({ username: 1 });
bdaSchema.index({ email: 1 });
bdaSchema.index({ status: 1 });

module.exports = mongoose.model('BDA', bdaSchema);