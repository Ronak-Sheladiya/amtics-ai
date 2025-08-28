# 🚀 Supabase Setup Instructions

Your Supabase project ID is configured: `rtugujirmkcwdmdiwzow`

## Step 1: Run Database Setup

1. **Go to your Supabase dashboard:**
   - Visit: https://supabase.com/dashboard/project/rtugujirmkcwdmdiwzow
   - Navigate to **SQL Editor**

2. **Run the setup script:**
   - Copy the entire content of `supabase-setup.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

## Step 2: Create Admin User

1. **Go to Authentication:**
   - In Supabase dashboard, go to **Authentication** → **Users**
   - Click **Add User**
   - Use these details:
     - Email: `admin@amtics.com` (or your preferred email)
     - Password: `Admin123!` (or your preferred password)
     - Confirm password: Same as above

2. **Make user an admin:**
   - After creating the user, go back to **SQL Editor**
   - Run this command (replace with your actual email):
   ```sql
   UPDATE public.users 
   SET role = 'admin', 
       name = 'Ronak Sheladiya',
       enrollment_number = '202203103510221',
       position = 'Vice-Chair',
       user_role = 'Graphic Designer',
       bio = 'Administrator and lead graphic designer at AMTICS Media'
   WHERE email = 'admin@amtics.com';
   ```

## Step 3: Test Login

1. **Go to your app login page:**
   - Visit: https://your-app-url.com/login
   - Use the credentials you created:
     - Email: `admin@amtics.com`
     - Password: `Admin123!`

2. **Access admin dashboard:**
   - After login, you should be redirected to `/admin/dashboard`
   - You'll see the admin interface with all features

## Step 4: Add More Users (Optional)

To add more team members:

1. **Create user in Supabase Auth:**
   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Enter their email and temporary password

2. **Update their profile:**
   ```sql
   UPDATE public.users 
   SET name = 'User Name',
       enrollment_number = 'ENROLLMENT_NUMBER',
       position = 'Their Position',
       role = 'member', -- or 'moderator'
       user_role = 'Their Specialization'
   WHERE email = 'user@email.com';
   ```

## 🔐 Demo Mode vs Production

The app automatically detects:
- **Production Mode**: When Supabase is properly configured
- **Demo Mode**: When Supabase credentials are missing (fallback)

### Demo Credentials (if needed):
- **Admin:** `admin@amtics.com` / `admin123`
- **Moderator:** `moderator@amtics.com` / `mod123`
- **Member:** `member@amtics.com` / `member123`

## 🛠️ Storage Setup (Optional)

For file uploads, create storage buckets:

1. **Go to Storage:**
   - In Supabase dashboard, go to **Storage**
   - Create these buckets:
     - `profile-images` (public)
     - `user-portfolios` (private)
     - `thumbnails` (public)

## ✅ Verification

After setup, you should have:
- ✅ Database tables created
- ✅ Admin user with login access
- ✅ Working authentication flow
- ✅ Admin dashboard accessible
- ✅ Member management system

## 🔧 Troubleshooting

**Login Issues:**
- Check user exists in Authentication → Users
- Verify user has correct role in `public.users` table
- Check browser console for error messages

**Database Issues:**
- Ensure all SQL scripts ran successfully
- Check table permissions and RLS policies
- Verify triggers are created

**Connection Issues:**
- Confirm environment variables are set correctly
- Check Supabase project status
- Verify API keys are valid

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Review Supabase logs in dashboard
3. Verify all setup steps were completed
4. Test with demo mode first to isolate issues
