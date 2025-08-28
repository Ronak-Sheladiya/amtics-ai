-- ============================================
-- ADMIN DASHBOARD DATABASE SCHEMA
-- ============================================

-- 1. USERS TABLE
-- Enhanced users table with role-based access and authentication
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

-- Insert default admin user
INSERT INTO users (
  name, 
  enrollment_number, 
  email, 
  position, 
  role, 
  user_role, 
  status, 
  actual_password_hash, 
  is_first_login, 
  is_onboarded
) VALUES (
  'Ronak Sheladiya',
  '202203103510221',
  '22amtics221@gmail.com',
  'Vice-Chair',
  'admin',
  'Graphic Designer',
  'active',
  '$2b$12$defaulthashedpassword', -- Replace with actual hashed password
  false,
  true
) ON CONFLICT (email) DO NOTHING;

-- 2. USER CONTENT VERIFICATION TABLE
-- Table for managing user-uploaded content that requires verification
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

-- 3. USER ACTIVITY LOGS TABLE
-- Comprehensive activity tracking for users
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

-- 4. DASHBOARD ANALYTICS TABLE
-- Store analytics data for dashboard insights
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

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_enrollment ON users(enrollment_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- User content indexes
CREATE INDEX IF NOT EXISTS idx_user_content_user_id ON user_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_status ON user_content(verification_status);
CREATE INDEX IF NOT EXISTS idx_user_content_type ON user_content(content_type);
CREATE INDEX IF NOT EXISTS idx_user_content_uploaded_at ON user_content(uploaded_at);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_date ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_session ON user_activity_logs(session_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON dashboard_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_period ON dashboard_analytics(period_start, period_end);

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Function to get user statistics for dashboard
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  total_members BIGINT,
  active_members BIGINT,
  retired_members BIGINT,
  pending_content BIGINT,
  verified_content BIGINT,
  declined_content BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM users WHERE role != 'admin')::BIGINT as total_members,
    (SELECT COUNT(*) FROM users WHERE role != 'admin' AND status = 'active')::BIGINT as active_members,
    (SELECT COUNT(*) FROM users WHERE role != 'admin' AND status = 'retired')::BIGINT as retired_members,
    (SELECT COUNT(*) FROM user_content WHERE verification_status = 'pending')::BIGINT as pending_content,
    (SELECT COUNT(*) FROM user_content WHERE verification_status = 'verified')::BIGINT as verified_content,
    (SELECT COUNT(*) FROM user_content WHERE verification_status = 'declined')::BIGINT as declined_content;
END;
$$ LANGUAGE plpgsql;

-- Function to update user's last login timestamp
CREATE OR REPLACE FUNCTION update_last_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET last_login = NOW(), updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
