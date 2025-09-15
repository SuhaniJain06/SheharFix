# SheharFix - Civic Issue Reporting System

A comprehensive civic issue reporting and management system built with React frontend and Node.js backend.

## Features

### 🏗️ Core Functionality
- **Issue Reporting**: Citizens can report civic issues with photos and location details
- **Issue Tracking**: Real-time status updates and progress monitoring
- **Work Order Management**: Assign and track work orders to contractors
- **Analytics Dashboard**: Comprehensive insights and reporting
- **Community Watch**: Safety alerts and community reporting
- **User Management**: Role-based access control (Citizens, Officials, Admins)

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Interactive Maps**: Location-based issue visualization
- **Real-time Updates**: Live notifications and status changes

### 🔧 Technical Features
- **RESTful API**: Well-structured backend with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **File Upload**: Image and document upload support
- **Validation**: Comprehensive input validation and error handling
- **Rate Limiting**: API protection against abuse

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)
- React Hook Form
- React Query
- Chart.js
- Leaflet (Maps)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)
- Express Validator
- Helmet (Security)
- CORS
- Morgan (Logging)

## Project Structure

```
SheharFix-2/
├── API/                          # Backend API
│   ├── controllers/              # Route controllers
│   ├── middleware/               # Custom middleware
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   ├── uploads/                  # File uploads directory
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Main server file
│   └── config.env                # Environment configuration
├── src/                          # Frontend source code
│   ├── Pages/                    # React pages
│   ├── Components/               # Reusable components
│   ├── Layout.js                 # Main layout component
│   ├── App.js                    # Main app component
│   └── utils.js                  # Utility functions
├── public/                       # Static files
├── package.json                  # Frontend dependencies
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance) - **Optional for initial setup**
- npm or yarn

### Quick Start (Without MongoDB)
If you want to test the application without setting up MongoDB first:

1. **Install dependencies and start servers:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd API
   npm install
   
   # Start backend (will show MongoDB warning but continue)
   npm start
   
   # In another terminal, start frontend
   cd ..
   npm start
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

**Note:** Without MongoDB, the database features won't work, but you can see the UI and test the frontend functionality.

### Full Setup (With MongoDB)

### Backend Setup

1. **Navigate to API directory:**
   ```bash
   cd API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `config.env` and update the values:
     ```env
     MONGODB_URI=mongodb://localhost:27017/sheharfix
     JWT_SECRET=your_super_secret_jwt_key_here
     PORT=5000
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```

4. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Issues
- `GET /api/issues` - Get all issues (with filtering)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/comments` - Add comment
- `POST /api/issues/:id/vote` - Vote on issue

### Work Orders
- `GET /api/work-orders` - Get all work orders
- `POST /api/work-orders` - Create work order
- `GET /api/work-orders/:id` - Get work order by ID
- `PUT /api/work-orders/:id` - Update work order
- `POST /api/work-orders/:id/progress` - Add progress update
- `POST /api/work-orders/:id/complete` - Complete work order

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/issues` - Issue analytics
- `GET /api/analytics/work-orders` - Work order analytics
- `GET /api/analytics/geographic` - Geographic analytics

## Database Models

### User
- Personal information and authentication
- Role-based access (citizen, official, admin)
- Preferences and settings

### CivicIssue
- Issue details and metadata
- Location information
- Status tracking and updates
- Comments and voting

### WorkOrder
- Work order details
- Assignment and progress tracking
- Budget and timeline management
- Quality checks and completion

### IssueUpdate
- Audit trail for all changes
- Notification triggers
- Progress tracking

### CommunityWatch
- Community safety reports
- Geographic clustering
- Verification and resolution

## Usage

### For Citizens
1. **Register/Login** to your account
2. **Report Issues** using the "Report Issue" page
3. **Track Progress** of your reported issues
4. **Vote and Comment** on community issues

### For Officials
1. **Access Admin Panel** with official privileges
2. **Manage Issues** - assign, update status, add progress
3. **Create Work Orders** for contractors
4. **View Analytics** for performance insights

### For Admins
1. **User Management** - manage user roles and permissions
2. **System Configuration** - configure system settings
3. **Advanced Analytics** - comprehensive reporting
4. **Issue Management** - full control over all issues

## Development

### Running in Development Mode

1. **Start MongoDB** (if running locally)
2. **Start Backend:**
   ```bash
   cd API
   npm run dev
   ```
3. **Start Frontend:**
   ```bash
   npm start
   ```

### Building for Production

1. **Build Frontend:**
   ```bash
   npm run build
   ```

2. **Start Production Backend:**
   ```bash
   cd API
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@sheharfix.com or join our community forum.

## Acknowledgments

- Built with ❤️ for better civic engagement
- Inspired by the need for transparent governance
- Community-driven development approach