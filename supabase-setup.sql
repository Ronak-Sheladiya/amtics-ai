-- ============================================
-- AMTICS ADMIN DASHBOARD - SUPABASE SETUP
-- ============================================
-- Run this script in your Supabase SQL Editor to set up the database

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    user_role VARCHAR(100), -- For specific roles like 'Graphic Designer'
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'retired')),
    profile_image_url TEXT,
    bio TEXT,
    additional_data JSONB DEFAULT '{}',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 2. Create user content table
CREATE TABLE IF NOT EXISTS public.user_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('image', 'document', 'portfolio', 'video')),
    title VARCHAR(255),
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'declined')),
    verified_by UUID REFERENCES public.users(id),
    verification_notes TEXT,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- 3. Create activity logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
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

-- 4. Create dashboard analytics table
CREATE TABLE IF NOT EXISTS public.dashboard_analytics (
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
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_enrollment ON public.users(enrollment_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

CREATE INDEX IF NOT EXISTS idx_user_content_user_id ON public.user_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_status ON public.user_content(verification_status);
CREATE INDEX IF NOT EXISTS idx_user_content_type ON public.user_content(content_type);

CREATE INDEX IF NOT EXISTS idx_activity_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON public.user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_date ON public.user_activity_logs(created_at);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- User content policies
CREATE POLICY "Users can manage their own content" ON public.user_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all content" ON public.user_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Activity logs policies
CREATE POLICY "Users can view their own activity" ON public.user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" ON public.user_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert activity logs" ON public.user_activity_logs
    FOR INSERT WITH CHECK (true);

-- Analytics policies (admin only)
CREATE POLICY "Only admins can access analytics" ON public.dashboard_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- ============================================
-- CREATE HELPER FUNCTIONS
-- ============================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
    total_members BIGINT,
    active_members BIGINT,
    retired_members BIGINT,
    pending_content BIGINT,
    verified_content BIGINT,
    declined_content BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.users WHERE role != 'admin')::BIGINT as total_members,
        (SELECT COUNT(*) FROM public.users WHERE role != 'admin' AND status = 'active')::BIGINT as active_members,
        (SELECT COUNT(*) FROM public.users WHERE role != 'admin' AND status = 'retired')::BIGINT as retired_members,
        (SELECT COUNT(*) FROM public.user_content WHERE verification_status = 'pending')::BIGINT as pending_content,
        (SELECT COUNT(*) FROM public.user_content WHERE verification_status = 'verified')::BIGINT as verified_content,
        (SELECT COUNT(*) FROM public.user_content WHERE verification_status = 'declined')::BIGINT as declined_content;
END;
$$;

-- ============================================
-- CREATE TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CREATE ADMIN USER FUNCTION
-- ============================================

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, name, enrollment_number, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'enrollment_number', 'TEMP-' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
        'active'
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- NOTE: You'll need to create the admin user through Supabase Auth first,
-- then update this user's record with admin privileges.
-- For now, we'll create a placeholder that you can update manually.

-- The admin user will be created when they first sign up through Supabase Auth
-- After signup, you can run this to make them admin:
-- UPDATE public.users 
-- SET role = 'admin', 
--     name = 'Ronak Sheladiya',
--     enrollment_number = '202203103510221',
--     position = 'Vice-Chair',
--     user_role = 'Graphic Designer',
--     bio = 'Administrator and lead graphic designer at AMTICS Media'
-- WHERE email = 'your-admin-email@example.com';

-- Add some sample members
INSERT INTO public.users (
    id, name, enrollment_number, email, position, role, user_role, status, bio, created_at
) VALUES 
(
    gen_random_uuid(),
    'Emily Rodriguez',
    '202203103510224',
    'emily@amtics.com',
    'Vice-President',
    'moderator',
    'UI/UX Designer',
    'active',
    'Passionate about creating user-centered designs',
    NOW()
),
(
    gen_random_uuid(),
    'Mike Chen',
    '202203103510225',
    'mike@amtics.com',
    'Coordinator',
    'member',
    'Mobile Developer',
    'active',
    'Mobile app development specialist',
    NOW()
),
(
    gen_random_uuid(),
    'Sarah Johnson',
    '202203103510226',
    'sarah@amtics.com',
    'Secretary',
    'member',
    'Content Writer',
    'active',
    'Content creation and writing specialist',
    NOW()
)
ON CONFLICT (enrollment_number) DO NOTHING;

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- To complete the setup:
-- 1. Run this SQL script in your Supabase SQL Editor
-- 2. Go to Authentication -> Users in Supabase dashboard
-- 3. Create a new user with your email (this will be the admin)
-- 4. Run this command with your actual email:
--    UPDATE public.users 
--    SET role = 'admin', 
--        name = 'Your Name',
--        enrollment_number = '202203103510221',
--        position = 'Administrator',
--        user_role = 'Admin'
--    WHERE email = 'your-email@example.com';

SELECT 'Supabase setup completed! Create an admin user in Auth > Users, then update their role to admin.' as status;
