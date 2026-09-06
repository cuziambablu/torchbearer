-- ==========================================
-- CampusLaunch: PostgreSQL Schema & RLS Setup
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
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

-- 2. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Remote',
    mode TEXT NOT NULL DEFAULT 'Remote',
    stipend TEXT,
    eligibility TEXT,
    target_branches TEXT[] DEFAULT '{}',
    target_years TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    application_process TEXT,
    deadline TIMESTAMPTZ,
    apply_url TEXT NOT NULL,
    source_url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'pending', 'published', 'expired', 'rejected')),
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SAVED OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Applied' CHECK (status IN ('Saved', 'Applied', 'Interview', 'Selected', 'Rejected')),
    applied_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- 5. OPPORTUNITY SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.opportunity_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name TEXT,
    student_email TEXT,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    mode TEXT DEFAULT 'Remote',
    stipend TEXT,
    eligibility TEXT,
    skills TEXT,
    deadline TIMESTAMPTZ,
    apply_url TEXT NOT NULL,
    source_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if requesting user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Opportunities Policies
CREATE POLICY "Published opportunities are viewable by everyone" 
ON public.opportunities FOR SELECT 
USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert opportunities" 
ON public.opportunities FOR INSERT 
WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update opportunities" 
ON public.opportunities FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete opportunities" 
ON public.opportunities FOR DELETE 
USING (public.is_admin());

-- Saved Opportunities Policies
CREATE POLICY "Users can view their own saved opportunities" 
ON public.saved_opportunities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save opportunities" 
ON public.saved_opportunities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved opportunities" 
ON public.saved_opportunities FOR DELETE 
USING (auth.uid() = user_id);

-- Applications Policies
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
ON public.applications FOR DELETE 
USING (auth.uid() = user_id);

-- Opportunity Submissions Policies
CREATE POLICY "Anyone can submit an opportunity" 
ON public.opportunity_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users view own submissions or admins view all" 
ON public.opportunity_submissions FOR SELECT 
USING (auth.uid() = submitted_by OR public.is_admin() OR auth.role() = 'authenticated');

CREATE POLICY "Admins can update submissions" 
ON public.opportunity_submissions FOR UPDATE 
USING (public.is_admin());

-- ==========================================
-- AUTOMATIC USER REGISTRATION TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, college, branch, year, role, skills, interests)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'college', 'Engineering College'),
    COALESCE(new.raw_user_meta_data->>'branch', 'CSE'),
    COALESCE(new.raw_user_meta_data->>'year', '3rd Year'),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    ARRAY['Python', 'React', 'Data Structures']::TEXT[],
    ARRAY['Internships', 'Hackathons']::TEXT[]
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
