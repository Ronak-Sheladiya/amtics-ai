-- ============================================
-- SUPABASE STORAGE BUCKETS AND POLICIES
-- ============================================

-- 1. CREATE STORAGE BUCKETS
-- Profile images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'profile-images', 
  'profile-images', 
  true, 
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- User portfolios bucket (private - admin access only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'user-portfolios', 
  'user-portfolios', 
  false, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Thumbnails bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'thumbnails', 
  'thumbnails', 
  true, 
  1048576, -- 1MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'documents', 
  'documents', 
  false, 
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- PROFILE IMAGES POLICIES
-- Allow users to upload their own profile images
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view profile images (public bucket)
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- USER PORTFOLIOS POLICIES
-- Allow users to upload to their own portfolio folder
CREATE POLICY "Users can upload to their portfolio folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own portfolio content
CREATE POLICY "Users can view their own portfolio" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all portfolio content
CREATE POLICY "Admins can view all portfolio content" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-portfolios' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow users to update their own portfolio files
CREATE POLICY "Users can update their own portfolio files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own portfolio files
CREATE POLICY "Users can delete their own portfolio files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- THUMBNAILS POLICIES
-- Allow users to upload thumbnails for their content
CREATE POLICY "Users can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'thumbnails' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view thumbnails (public bucket)
CREATE POLICY "Anyone can view thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');

-- Allow users to update their own thumbnails
CREATE POLICY "Users can update their own thumbnails" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'thumbnails' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete their own thumbnails" ON storage.objects
FOR DELETE USING (
  bucket_id = 'thumbnails' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- DOCUMENTS POLICIES
-- Allow users to upload documents to their folder
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own documents
CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES FOR DATABASE TABLES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Allow admins to manage all users
CREATE POLICY "Admins can manage all users" ON users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- USER CONTENT POLICIES
-- Allow users to manage their own content
CREATE POLICY "Users can manage their own content" ON user_content
FOR ALL USING (auth.uid() = user_id);

-- Allow admins to view and verify all content
CREATE POLICY "Admins can manage all content" ON user_content
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- USER ACTIVITY LOGS POLICIES
-- Allow users to view their own activity logs
CREATE POLICY "Users can view their own activity" ON user_activity_logs
FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to view all activity logs
CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Allow system to insert activity logs
CREATE POLICY "System can insert activity logs" ON user_activity_logs
FOR INSERT WITH CHECK (true);

-- DASHBOARD ANALYTICS POLICIES
-- Only admins can access analytics
CREATE POLICY "Only admins can access analytics" ON dashboard_analytics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
