-- Comprehensive Admin Dashboard Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enhanced Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  enrollment_number VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  user_role VARCHAR(100), -- For specific roles like 'Graphic Designer'
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  temp_password VARCHAR(255),
  actual_password_hash VARCHAR(255),
  is_first_login BOOLEAN DEFAULT true,
  is_onboarded BOOLEAN DEFAULT false,
  profile_image_url TEXT,
  bio TEXT,
  additional_data JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Insert default admin member
INSERT INTO users (name, enrollment_number, email, position, role, user_role, status, actual_password_hash, is_first_login, is_onboarded) 
VALUES (
  'Ronak Sheladiya',
  '202203103510221',
  '22amtics221@gmail.com',
  'Vice-Chair',
  'admin',
  'Graphic Designer',
  'active',
  '$2b$12$LQv3c1yqBw1sAfD8cKDvnO8QQYnYJJ1YKW1YQcJz6QQYnYJJ1YKW1',
  false,
  true
) ON CONFLICT (email) DO NOTHING;

-- 2. User Content Verification Table
CREATE TABLE IF NOT EXISTS user_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('image', 'document', 'portfolio', 'video')),
  title VARCHAR(255),
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'declined')),
  verified_by UUID REFERENCES users(id),
  verification_notes TEXT,
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 3. User Activity Log Table
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  action_description TEXT,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dashboard Analytics Table
CREATE TABLE IF NOT EXISTS dashboard_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  period_type VARCHAR(20) DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_content_user_id ON user_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_status ON user_content(verification_status);
CREATE INDEX IF NOT EXISTS idx_user_content_type ON user_content(content_type);
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_date ON user_activity_logs(created_at);

-- Create Storage Buckets (Run these separately in Storage section)
-- Profile Images Bucket: profile-images (public)
-- User Portfolios Bucket: user-portfolios (private)
-- Thumbnails Bucket: thumbnails (public)

-- RLS Policies (Enable Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User content policies
CREATE POLICY "Users can view their own content" ON user_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all content" ON user_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can upload content" ON user_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update content verification" ON user_content
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Activity logs policies
CREATE POLICY "Users can view their own activity" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow activity logging" ON user_activity_logs
    FOR INSERT WITH CHECK (true);

-- Dashboard analytics policies
CREATE POLICY "Admins can view analytics" ON dashboard_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total_members bigint,
    active_members bigint,
    new_this_month bigint,
    pending_content bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT count(*) FROM users WHERE role != 'admin') as total_members,
        (SELECT count(*) FROM users WHERE role != 'admin' AND status = 'active') as active_members,
        (SELECT count(*) FROM users WHERE role != 'admin' AND created_at >= date_trunc('month', now())) as new_this_month,
        (SELECT count(*) FROM user_content WHERE verification_status = 'pending') as pending_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
