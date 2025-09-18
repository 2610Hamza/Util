// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE as string;

if (!url || !serviceKey) {
  console.warn('[SupabaseAdmin] Missing env vars');
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
