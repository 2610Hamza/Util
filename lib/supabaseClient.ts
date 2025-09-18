// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Petit garde‑fou pour éviter un "undefined"
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Variables manquantes. Pense à les ajouter dans Vercel → Settings → Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
