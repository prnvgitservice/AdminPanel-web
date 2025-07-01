# PRNV Services Backend API

A comprehensive Node.js backend API for the PRNV Services Admin Dashboard.

## 🚀 Features

- **Authentication & Authorization**: JWT-based admin authentication with role-based permissions
- **User Management**: Complete CRUD operations for users with profile management
- **Provider Management**: Provider registration, verification, and subscription management
- **Service Management**: Service creation, approval workflow, and categorization
- **BDA Management**: Business Development Associate management with commission tracking
- **File Upload**: Image upload with validation and storage
- **Dashboard Analytics**: Real-time statistics and analytics
- **Security**: Rate limiting, input validation, and security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/prnv-services
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@prnvservices.com
   ADMIN_PASSWORD=admin123
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Seed admin user**
   ```bash
   node scripts/seedAdmin.js
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Current Admin
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Management Endpoints

#### Get All Users
```http
GET /api/users?page=1&limit=10&status=active&search=john
Authorization: Bearer <token>
```

#### Create User
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "status": "active"
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "John Smith",
  "status": "inactive"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

#### Toggle User Status
```http
PATCH /api/users/:id/status
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

#### Get Analytics
```http
GET /api/dashboard/analytics
Authorization: Bearer <token>
```

## 🗄️ Database Models

### Admin Model
- Authentication and authorization
- Role-based permissions
- Account locking for security

### User Model
- User profile management
- Status tracking
- Location information

### Provider Model
- Provider verification
- Subscription management
- Service gallery
- BDA assignment

### Service Model
- Service categorization
- Approval workflow
- Location-based services
- Meta information for SEO

### BDA Model
- Commission tracking
- Bank details
- Provider assignments

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: Bcrypt for secure password storage
- **Account Locking**: Prevents brute force attacks
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: Helmet.js for security headers

## 📊 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## 🚀 Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Ensure MongoDB is accessible
3. **File Storage**: Configure file upload directory
4. **Process Manager**: Use PM2 for production

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "prnv-api"

# Monitor
pm2 monit
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors if any
  ]
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading
- **Compression**: Gzip compression for responses
- **Caching**: Response caching where appropriate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.