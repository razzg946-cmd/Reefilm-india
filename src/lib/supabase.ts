import { createClient } from "@supabase/supabase-js";

// Fetch from Vite environment variables first
let staticUrl = (
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  ""
).trim();

let staticKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  ""
).trim();

// Runtime dynamic credentials
let dynamicUrl = "";
let dynamicKey = "";

export const setDynamicSupabaseConfig = (url: string, key: string) => {
  dynamicUrl = (url || "").trim();
  dynamicKey = (key || "").trim();
  supabaseClientInstance = null; // Reset client instance to force re-creation
};

const getActiveUrl = (): string => {
  return dynamicUrl || staticUrl;
};

const getActiveKey = (): string => {
  return dynamicKey || staticKey;
};

export const isSupabaseConfigured = (): boolean => {
  const url = getActiveUrl();
  const key = getActiveKey();
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const isPlaceholder = 
    url.includes("your-") || 
    url.includes("placeholder") || 
    key.includes("your-") || 
    key.includes("placeholder");
  return !!(url && key && isValidUrl && !isPlaceholder);
};

// Lazy initialization of Supabase client to avoid crashes
let supabaseClientInstance: any = null;

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseClientInstance) {
    const url = getActiveUrl();
    const key = getActiveKey();
    supabaseClientInstance = createClient(url, key);
  }
  return supabaseClientInstance;
};

// Helper to fetch credentials from server API on boot
export const initializeSupabaseDynamically = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/supabase-config");
    if (response.ok) {
      const data = await response.json();
      if (data && data.supabaseUrl && data.supabaseAnonKey) {
        const url = data.supabaseUrl.trim();
        const key = data.supabaseAnonKey.trim();
        const isValid = url.startsWith("http://") || url.startsWith("https://");
        const isPlace = url.includes("your-") || url.includes("placeholder") || key.includes("your-") || key.includes("placeholder");
        if (url && key && isValid && !isPlace) {
          setDynamicSupabaseConfig(url, key);
          return true;
        }
      }
    }
  } catch (err) {
    console.error("Failed to dynamically initialize Supabase client on client startup:", err);
  }
  return false;
};
