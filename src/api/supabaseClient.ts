import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set — Supabase sign-in will be unavailable.");
}

export const SUPABASE_STORAGE_KEY = "tapit_supabase_auth";

export const supabase = supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: { detectSessionInUrl: false, storageKey: SUPABASE_STORAGE_KEY },
    })
    : null;
