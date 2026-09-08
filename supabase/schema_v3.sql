-- ==========================================
-- CampusLaunch Schema V3: Enterprise Production Schema
-- ==========================================

-- 1. SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    base_url TEXT,
    source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('api', 'rss', 'manual', 'partner', 'import', 'community')),
    enabled BOOLEAN DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Default Sources
INSERT INTO public.sources (name, base_url, source_type, enabled)
VALUES 
    ('Official Career Portal', 'https://campuslaunch.org', 'manual', true),
    ('Google Open Source', 'https://summerofcode.withgoogle.com', 'partner', true),
    ('GitHub Education', 'https://education.github.com', 'partner', true),
    ('Microsoft Global', 'https://imaginecup.microsoft.com', 'partner', true),
    ('AWS Academy', 'https://aws.amazon.com/training/awsacademy/', 'partner', true),
    ('AICTE Government Portal', 'https://aicte-india.org', 'partner', true),
    ('Major League Hacking', 'https://mlh.io', 'partner', true),
    ('Linux Foundation', 'https://linuxfoundation.org', 'partner', true),
    ('Admin CSV Import', 'https://campuslaunch.org/admin', 'import', true),
    ('Student Community Verified', 'https://campuslaunch.org/submit', 'community', true)
ON CONFLICT (name) DO NOTHING;

-- 2. ENHANCE OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    mode TEXT DEFAULT 'Remote' CHECK (mode IN ('Remote', 'Hybrid', 'On-site')),
    stipend TEXT,
    prize TEXT,
    eligibility TEXT DEFAULT 'All undergraduate students',
    target_branches TEXT[] DEFAULT ARRAY['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    target_years TEXT[] DEFAULT ARRAY['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    application_process TEXT,
    deadline TIMESTAMPTZ,
    start_date TIMESTAMPTZ,
    apply_url TEXT NOT NULL,
    source_url TEXT,
    source_name TEXT DEFAULT 'Official Source',
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    image_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'expired', 'archived')),
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    verified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    last_verified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    featured BOOLEAN DEFAULT false,
    is_college_exclusive BOOLEAN DEFAULT false,
    is_official_college BOOLEAN DEFAULT false,
    college_name TEXT,
    views INTEGER DEFAULT 0,
    fingerprint TEXT UNIQUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for high-performance searching and filtering
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_mode ON public.opportunities(mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_status_verification ON public.opportunities(status, verification_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_fingerprint ON public.opportunities(fingerprint);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON public.opportunities(featured);

-- 3. REPORTS TABLE (For broken links, fake listings, expired opportunities)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    opportunity_title TEXT,
    reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_email TEXT,
    reason TEXT NOT NULL CHECK (reason IN ('broken_link', 'expired', 'fake_scam', 'incorrect_info', 'duplicate', 'other')),
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_opportunity ON public.reports(opportunity_id);

-- 4. SAVED OPPORTUNITIES & APPLICATIONS
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Applied' CHECK (status IN ('Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
    applied_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    interview_date TIMESTAMPTZ,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'deadline' CHECK (type IN ('deadline', 'recommendation', 'submission', 'status_update', 'report', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- 6. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- 7. AUTOMATED EXPIRATION FUNCTION
CREATE OR REPLACE FUNCTION public.expire_past_deadlines()
RETURNS INTEGER AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE public.opportunities
    SET status = 'expired',
        verification_status = 'expired',
        updated_at = NOW()
    WHERE deadline IS NOT NULL 
      AND deadline < NOW() 
      AND status != 'expired';
      
    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Sources
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sources' AND policyname = 'Anyone can view active sources') THEN
        CREATE POLICY "Anyone can view active sources" ON public.sources FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sources' AND policyname = 'Admins can manage sources') THEN
        CREATE POLICY "Admins can manage sources" ON public.sources FOR ALL USING (true);
    END IF;

    -- Reports
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Anyone can submit reports') THEN
        CREATE POLICY "Anyone can submit reports" ON public.reports FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Admins can view and manage reports') THEN
        CREATE POLICY "Admins can view and manage reports" ON public.reports FOR ALL USING (true);
    END IF;

    -- Notifications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications') THEN
        CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'System can insert notifications') THEN
        CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
    END IF;

    -- Admin logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_logs' AND policyname = 'Admins can view audit logs') THEN
        CREATE POLICY "Admins can view audit logs" ON public.admin_logs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_logs' AND policyname = 'Admins can insert audit logs') THEN
        CREATE POLICY "Admins can insert audit logs" ON public.admin_logs FOR INSERT WITH CHECK (true);
    END IF;
END $$;
