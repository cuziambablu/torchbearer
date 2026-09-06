-- ==========================================
-- CampusLaunch Schema V2: Enterprise Enhancements
-- ==========================================

-- 1. SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    base_url TEXT,
    source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('api', 'rss', 'manual', 'partner', 'import')),
    enabled BOOLEAN DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Default Sources
INSERT INTO public.sources (name, base_url, source_type, enabled)
VALUES 
    ('Official Career Portal', 'https://campuslaunch.org', 'manual', true),
    ('GitHub Education', 'https://education.github.com', 'partner', true),
    ('Unstop', 'https://unstop.com', 'partner', true),
    ('MLH Hackathons', 'https://mlh.io', 'partner', true),
    ('Government Portal', 'https://aicte-india.org', 'partner', true),
    ('Admin CSV Import', 'https://campuslaunch.org/admin', 'import', true)
ON CONFLICT (name) DO NOTHING;

-- 2. ENHANCE OPPORTUNITIES TABLE
ALTER TABLE public.opportunities 
    ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Official Source',
    ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS prize TEXT,
    ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    ADD COLUMN IF NOT EXISTS is_college_exclusive BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_official_college BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS college_name TEXT,
    ADD COLUMN IF NOT EXISTS organization_logo TEXT,
    ADD COLUMN IF NOT EXISTS fingerprint TEXT;

-- Index for duplicate detection & fast querying
CREATE INDEX IF NOT EXISTS idx_opportunities_fingerprint ON public.opportunities(fingerprint);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_status_verification ON public.opportunities(status, verification_status);

-- 3. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'deadline' CHECK (type IN ('deadline', 'recommendation', 'submission', 'status_update', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- 4. ADMIN AUDIT LOGS TABLE
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

-- 5. AUTOMATED EXPIRATION FUNCTION
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

-- 6. RLS POLICIES FOR NEW TABLES
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sources' AND policyname = 'Anyone can view active sources') THEN
        CREATE POLICY "Anyone can view active sources" ON public.sources FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sources' AND policyname = 'Admins can manage sources') THEN
        CREATE POLICY "Admins can manage sources" ON public.sources FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications') THEN
        CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'System can insert notifications') THEN
        CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_logs' AND policyname = 'Admins can view audit logs') THEN
        CREATE POLICY "Admins can view audit logs" ON public.admin_logs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_logs' AND policyname = 'Admins can insert audit logs') THEN
        CREATE POLICY "Admins can insert audit logs" ON public.admin_logs FOR INSERT WITH CHECK (true);
    END IF;
END $$;
