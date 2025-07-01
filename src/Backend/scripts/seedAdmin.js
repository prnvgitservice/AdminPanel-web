const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prnv-services');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Super Admin',
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@prnvservices.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'super-admin',
      status: 'active',
      permissions: [
        {
          module: 'users',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'providers',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'services',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'admin',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'bda',
          actions: ['create', 'read', 'update', 'delete']
        }
      ]
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();