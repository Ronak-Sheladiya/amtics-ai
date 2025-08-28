# AMTICS Admin Dashboard System

A comprehensive admin dashboard with role-based access control, member management, content verification, and user activity tracking using React and Supabase.

## 🚀 Features

### Authentication & Access Control
- **Role-based authentication** (Admin, Moderator, Member)
- **Protected routes** with automatic redirection
- **Session management** with Supabase Auth
- **First-time login flow** with password change requirement

### Admin Dashboard Tabs
1. **Dashboard Overview**
   - Real-time analytics and metrics
   - Member statistics and trends
   - Recent activity feed
   - Visual charts and graphs

2. **Members Management**
   - Complete CRUD operations for team members
   - Table and card view modes
   - Advanced filtering and search
   - Status management (Active/Retired)
   - Bulk operations and export functionality

3. **Content Verification**
   - Review user-uploaded content
   - Approve/decline content with notes
   - Support for images, videos, documents
   - Advanced filtering by type and status

4. **User Activity Logs**
   - Comprehensive activity tracking
   - Detailed session information
   - Device and IP tracking
   - Exportable activity reports

5. **Admin Profile Management**
   - Profile information editing
   - Password change functionality
   - Image upload capabilities
   - Security settings

## 🛠 Setup Instructions

### 1. Supabase Project Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials**:
   - Project URL: `https://your-project-id.supabase.co`
   - Anon Key: Found in Project Settings > API

3. **Run the database schema**:
   - Open the SQL Editor in your Supabase dashboard
   - Copy and paste the content from `supabase-schema.sql`
   - Execute the SQL to create all tables, policies, and functions

4. **Set up Storage Buckets**:
   - Go to Storage in your Supabase dashboard
   - Create the following buckets:
     - `profile-images` (public)
     - `user-portfolios` (private)
     - `thumbnails` (public)

5. **Configure Environment Variables**:
   The environment variables are already set via DevServerControl:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key (replace placeholder)

### 2. Update Environment Variables

Replace the placeholder in the environment variables:

```bash
# Update the Supabase anon key
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

### 3. Default Admin Account

The system comes with a default admin account:
- **Email**: `22amtics221@gmail.com`
- **Name**: `Ronak Sheladiya`
- **Role**: `admin`
- **Position**: `Vice-Chair`
- **Specialization**: `Graphic Designer`

**Important**: Update the password hash in the database schema with your secure password before deployment.

## 🔐 Authentication Flow

### Login Process
1. User navigates to `/login`
2. Enters email and password
3. System validates credentials via Supabase Auth
4. Redirects based on user role:
   - Admin → `/admin/dashboard`
   - Member → `/dashboard`

### Route Protection
- **Public Routes**: `/`, `/about`, `/team`, `/developer`, `/card/:id`
- **Authentication Required**: All `/admin/*` routes
- **Admin Only**: All admin dashboard functionality
- **Guest Only**: `/login` (redirects authenticated users)

## 📊 Database Schema

### Core Tables
1. **users** - User accounts with roles and profile information
2. **user_content** - File uploads with verification status
3. **user_activity_logs** - Comprehensive activity tracking
4. **dashboard_analytics** - System metrics and analytics

### Key Features
- **Row Level Security (RLS)** enabled on all tables
- **Comprehensive indexing** for performance
- **Audit trails** with created/updated timestamps
- **Soft deletes** and status management

## 🎨 Styling & Theming

### CSS Architecture
- **CSS Custom Properties** for consistent theming
- **Dark/Light theme support** via ThemeContext
- **Responsive design** with mobile-first approach
- **Component-scoped styles** with BEM methodology

### Responsive Breakpoints
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## 🔧 Component Architecture

### Context Providers
- **AuthContext**: User authentication and session management
- **ThemeContext**: Dark/light theme switching

### Protected Routes
- **ProtectedRoute**: Base authentication checking
- **AdminRoute**: Admin-only access
- **GuestRoute**: Unauthenticated users only
- **RoleRedirect**: Automatic role-based redirection

### Admin Components
- **AdminDashboard**: Main dashboard container
- **AdminSidebar**: Navigation and user profile
- **AdminHeader**: Top bar with search and notifications
- **Tab Components**: Individual feature modules

## 📱 Mobile Responsiveness

### Mobile Features
- **Collapsible sidebar** with overlay
- **Touch-friendly interfaces**
- **Responsive tables** with horizontal scroll
- **Adaptive layouts** for all screen sizes
- **Mobile-optimized forms** and modals

## 🚦 User Roles & Permissions

### Admin
- Full system access
- Member management (CRUD)
- Content verification
- Activity log access
- System analytics

### Moderator
- Content verification
- Limited member management
- Activity log viewing

### Member
- Profile management
- Content upload
- Basic dashboard access

## 📈 Analytics & Monitoring

### Dashboard Metrics
- **Total Members**: Count of all registered users
- **Active Members**: Currently active users
- **Pending Content**: Unverified uploads
- **Monthly Activity**: Recent user actions

### Activity Tracking
- **Login/Logout Events**
- **Content Upload/Verification**
- **Profile Updates**
- **Administrative Actions**
- **IP and Device Information**

## 🔒 Security Features

### Authentication Security
- **Password hashing** with bcrypt
- **Session management** via Supabase
- **Route protection** with role verification
- **CSRF protection** through Supabase Auth

### Data Security
- **Row Level Security** on all tables
- **Input validation** and sanitization
- **File upload restrictions**
- **Activity logging** for audit trails

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Update Supabase RLS policies for production
3. Configure CORS settings in Supabase
4. Set up proper domain authentication

### Production Checklist
- [ ] Update default admin password
- [ ] Set strong JWT secret
- [ ] Configure email templates
- [ ] Set up monitoring and logging
- [ ] Test all user flows
- [ ] Verify mobile responsiveness

## 🛠 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure
```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   │   ├── tabs/        # Dashboard tab components
│   │   └── modals/      # Modal components
│   ├── pages/           # Page components
│   └── ProtectedRoute.jsx
├── contexts/            # React contexts
├── config/              # Configuration files
├── styles/              # CSS files
└── utils/               # Utility functions
```

## 🐛 Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all Supabase credentials are correctly set
2. **Database Permissions**: Check RLS policies are properly configured
3. **Authentication Issues**: Verify Supabase Auth settings
4. **Build Errors**: Ensure all dependencies are installed

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## 📚 API Reference

### Supabase Helper Functions
- `dbHelpers.getUsers()` - Fetch users with filters
- `dbHelpers.createUser()` - Create new user
- `dbHelpers.updateUser()` - Update user information
- `dbHelpers.getContent()` - Fetch content for verification
- `dbHelpers.verifyContent()` - Approve/decline content
- `dbHelpers.getActivityLogs()` - Fetch activity logs
- `dbHelpers.logActivity()` - Log user actions

### Authentication Functions
- `authHelpers.signIn()` - User login
- `authHelpers.signOut()` - User logout
- `authHelpers.resetPassword()` - Password reset

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Test all functionality before submitting
3. Update documentation for new features
4. Ensure mobile responsiveness
5. Add proper error handling

## 📄 License

This project is part of the AMTICS Media platform and follows the organization's licensing terms.

---

**Note**: This is a comprehensive admin dashboard system. Ensure you have proper Supabase credentials and have run the database schema before attempting to use the system.

For support or questions about the implementation, refer to the code comments and component documentation.
