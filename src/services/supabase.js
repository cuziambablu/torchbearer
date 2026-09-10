import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://qdiphucxwukjfjfxsmsm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaXBodWN4d3VramZqZnhzbXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODEwMTcsImV4cCI6MjA5NDA1NzAxN30.W7hzgDGqQ-P8q8m6q9Gpq2jgkRtlVE_suvD40NZtvfE';

const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL;
const envKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = envUrl || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = envKey || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
