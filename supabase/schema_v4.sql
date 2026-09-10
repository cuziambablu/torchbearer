-- ==============================================================================
-- CAMPUSLAUNCH SCHEMA V4 — AI OPPORTUNITY AGENT, AUDIT & REVIEW QUEUE
-- ==============================================================================

-- 1. Extend opportunities table with AI Agent & verification columns
ALTER TABLE IF EXISTS public.opportunities 
  ADD COLUMN IF NOT EXISTS company_logo TEXT,
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS internship_type TEXT DEFAULT 'Internship',
  ADD COLUMN IF NOT EXISTS stipend_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '3 Months',
  ADD COLUMN IF NOT EXISTS work_mode TEXT DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'On-site', 'Hybrid')),
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS education_level TEXT DEFAULT 'Undergraduate',
  ADD COLUMN IF NOT EXISTS experience_required TEXT DEFAULT 'None (Students / Freshers)',
  ADD COLUMN IF NOT EXISTS verification_score INTEGER DEFAULT 85,
  ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 88,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS posted_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create Agent Runs Table
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'scheduled', 'api')),
  stats JSONB DEFAULT '{
    "discovered": 0,
    "extracted": 0,
    "duplicates_removed": 0,
    "verified": 0,
    "needs_review": 0,
    "rejected": 0,
    "published": 0,
    "failed_sources": 0
  }'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Agent Execution Logs Table
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stage TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'success')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb
);

-- 4. Create Review Queue Table (for opportunities scoring 50-74)
CREATE TABLE IF NOT EXISTS public.review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_data JSONB NOT NULL,
  verification_score INTEGER NOT NULL,
  quality_score INTEGER NOT NULL,
  flag_reasons TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'edited')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_opp_verification_score ON public.opportunities (verification_score);
CREATE INDEX IF NOT EXISTS idx_opp_work_mode ON public.opportunities (work_mode);
CREATE INDEX IF NOT EXISTS idx_opp_last_verified_at ON public.opportunities (last_verified_at);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON public.agent_runs (status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_run_id ON public.agent_logs (run_id);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON public.review_queue (status);

-- 6. Enable Row-Level Security (RLS)
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;

-- 7. Policies for Agent & Review Queue
DO $$ 
BEGIN
  -- agent_runs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_runs' AND policyname = 'Admins can manage agent runs') THEN
    CREATE POLICY "Admins can manage agent runs" ON public.agent_runs FOR ALL USING (true);
  END IF;

  -- agent_logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_logs' AND policyname = 'Admins can view agent logs') THEN
    CREATE POLICY "Admins can view agent logs" ON public.agent_logs FOR ALL USING (true);
  END IF;

  -- review_queue policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_queue' AND policyname = 'Admins can manage review queue') THEN
    CREATE POLICY "Admins can manage review queue" ON public.review_queue FOR ALL USING (true);
  END IF;
END $$;
