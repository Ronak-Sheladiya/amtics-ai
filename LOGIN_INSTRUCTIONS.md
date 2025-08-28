# Login Instructions for AMTICS Admin Dashboard

## 🔐 Access URLs

### Login Page
**URL**: `/login`
- Direct link: [http://localhost:3000/login](http://localhost:3000/login)

### Admin Dashboard
**URL**: `/admin/dashboard`
- Direct link: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Note**: Only accessible after logging in as an admin

## 👤 Demo Admin Account

Since this is a demo implementation, you can use these test credentials:

### Default Admin User
- **Email**: `admin@amtics.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Name**: Ronak Sheladiya

### Additional Demo Users
- **Moderator**: `moderator@amtics.com` / `mod123`
- **Member**: `member@amtics.com` / `member123`

## 🚀 Quick Start

1. **Navigate to the login page**: Click the "Admin Login" button in the top-right corner
2. **Enter credentials**: Use the demo admin credentials above
3. **Access dashboard**: After successful login, you'll be redirected to the admin dashboard

## 🛠 Setting Up Real Authentication

To use this with real Supabase authentication:

1. **Update Supabase credentials**:
   ```bash
   # Replace the placeholder anon key with your real Supabase anon key
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

2. **Create admin user in Supabase**:
   - Go to your Supabase dashboard
   - Navigate to Authentication > Users
   - Create a new user with admin role
   - Or run the SQL schema provided in `supabase-schema.sql`

3. **Test the login flow**:
   - Navigate to `/login`
   - Enter your Supabase user credentials
   - System will authenticate via Supabase Auth

## 📱 Navigation Helper

A convenient navigation helper is displayed in the top-right corner of all pages:

- **When not logged in**: Shows "Admin Login" button
- **When logged in as admin**: Shows "Admin Dashboard" and "Logout" buttons
- **Mobile responsive**: Adapts to smaller screens

## 🔄 Demo Mode

Currently, the system is running in demo mode with:
- Mock authentication (bypasses Supabase for demo purposes)
- Sample data for dashboard analytics
- All admin features fully functional
- No real database connections required

## 🎯 Available Admin Features

Once logged in, you'll have access to:

1. **Dashboard Overview** - System analytics and metrics
2. **Members Management** - Add, edit, view, and manage team members
3. **Content Verification** - Review and approve user content
4. **Activity Logs** - Monitor user activities and system events
5. **Profile Settings** - Manage admin profile and security

## 🔧 Troubleshooting

### Can't access login page?
- Make sure you're using `/login` (lowercase)
- Check if the development server is running
- Try refreshing the page

### Login not working?
- For demo mode, use the provided demo credentials
- For Supabase mode, ensure your anon key is set correctly
- Check browser console for any errors

### Can't access admin dashboard?
- Ensure you're logged in with admin privileges
- Try navigating directly to `/admin/dashboard`
- Check if you were redirected after login

## 🌐 URL Structure

- **Home**: `/`
- **Login**: `/login`
- **Admin Dashboard**: `/admin/dashboard`
- **About**: `/about`
- **Team**: `/team`
- **Developer**: `/developer`

The system automatically redirects users based on their authentication status and role.
