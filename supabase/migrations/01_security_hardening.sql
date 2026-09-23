-- ==============================================================================
-- TORCHBEARER AI — SECURITY & RLS HARDENING MIGRATION (PHASE 1)
-- ==============================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure profiles table structure & role constraint
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    college TEXT,
    branch TEXT DEFAULT 'CSE',
    year TEXT DEFAULT '3rd Year',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    bio TEXT,
    github TEXT,
    linkedin TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure role column exists if profiles was created previously
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin'));

-- 3. Robust SECURITY DEFINER Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS \$\$
BEGIN
  -- 1. Check if executing with service_role privileges
  IF (COALESCE(current_setting('request.jwt.claim.role', true), '') = 'service_role' 
      OR (auth.jwt() ->> 'role') = 'service_role') THEN
    RETURN true;
  END IF;

  -- 2. Check if the authenticated user has the 'admin' role in public.profiles
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Secure Helper Function to Assign Admin Role (Can only be run by service_role/superusers or existing admins)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS VOID AS \$\$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can promote users.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin', updated_at = NOW()
  WHERE LOWER(email) = LOWER(TRIM(target_email));
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Enable Row-Level Security on all public tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.opportunity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.review_queue ENABLE ROW LEVEL SECURITY;

-- 6. Rebuild RLS Policies (Clean up old permissive USING (true) policies)

-- --- PROFILES POLICIES ---
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

-- --- OPPORTUNITIES POLICIES ---
DROP POLICY IF EXISTS "Published opportunities are viewable by everyone" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can delete opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can manage opportunities" ON public.opportunities;

CREATE POLICY "Published opportunities are viewable by everyone" 
ON public.opportunities FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert opportunities" 
ON public.opportunities FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update opportunities" 
ON public.opportunities FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete opportunities" 
ON public.opportunities FOR DELETE 
USING (public.is_admin());

-- --- SOURCES POLICIES ---
DROP POLICY IF EXISTS "Anyone can view active sources" ON public.sources;
DROP POLICY IF EXISTS "Admins can manage sources" ON public.sources;

CREATE POLICY "Anyone can view active sources" 
ON public.sources FOR SELECT 
USING (enabled = true OR public.is_admin());

CREATE POLICY "Admins can insert sources" 
ON public.sources FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sources" 
ON public.sources FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete sources" 
ON public.sources FOR DELETE 
USING (public.is_admin());

-- --- REPORTS POLICIES ---
DROP POLICY IF EXISTS "Anyone can submit reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view and manage reports" ON public.reports;

CREATE POLICY "Anyone can submit reports" 
ON public.reports FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view reports" 
ON public.reports FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update reports" 
ON public.reports FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete reports" 
ON public.reports FOR DELETE 
USING (public.is_admin());

-- --- ADMIN AUDIT LOGS POLICIES ---
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_logs;

CREATE POLICY "Admins can view audit logs" 
ON public.admin_logs FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert audit logs" 
ON public.admin_logs FOR INSERT 
WITH CHECK (public.is_admin());

-- --- AGENT RUNS & LOGS POLICIES ---
DROP POLICY IF EXISTS "Admins can manage agent runs" ON public.agent_runs;
DROP POLICY IF EXISTS "Admins can view agent logs" ON public.agent_logs;
DROP POLICY IF EXISTS "Admins can insert agent logs" ON public.agent_logs;

CREATE POLICY "Admins can select agent runs" 
ON public.agent_runs FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert agent runs" 
ON public.agent_runs FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update agent runs" 
ON public.agent_runs FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can select agent logs" 
ON public.agent_logs FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert agent logs" 
ON public.agent_logs FOR INSERT 
WITH CHECK (public.is_admin());

-- --- REVIEW QUEUE POLICIES ---
DROP POLICY IF EXISTS "Admins can manage review queue" ON public.review_queue;

CREATE POLICY "Admins can select review queue" 
ON public.review_queue FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert review queue" 
ON public.review_queue FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update review queue" 
ON public.review_queue FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete review queue" 
ON public.review_queue FOR DELETE 
USING (public.is_admin());

-- --- SAVED OPPORTUNITIES & APPLICATIONS POLICIES ---
DROP POLICY IF EXISTS "Users can view their own saved opportunities" ON public.saved_opportunities;
DROP POLICY IF EXISTS "Users can save opportunities" ON public.saved_opportunities;
DROP POLICY IF EXISTS "Users can remove their saved opportunities" ON public.saved_opportunities;

CREATE POLICY "Users can view their own saved opportunities" 
ON public.saved_opportunities FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can save opportunities" 
ON public.saved_opportunities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved opportunities" 
ON public.saved_opportunities FOR DELETE 
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;

CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete their own applications" 
ON public.applications FOR DELETE 
USING (auth.uid() = user_id OR public.is_admin());
