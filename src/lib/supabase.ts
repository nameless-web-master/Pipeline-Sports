
// `lib/supabaseClient.ts`
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is installed


// Supabase project URL
export const SUPABASE_URL: string = 'https://dswptzhcmjnylautdeea.supabase.co'

// Supabase anon (public) API key
export const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzd3B0emhjbWpueWxhdXRkZWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzA3ODcsImV4cCI6MjA3MjcwNjc4N30.QuOs2KHA560HGaCpFShu3j1DJZnPcXtj6txAaaXNzNs'

export const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzd3B0emhjbWpueWxhdXRkZWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzEzMDc4NywiZXhwIjoyMDcyNzA2Nzg3fQ.bNtZFccQ0bHAV3V4oxuXw2p7h627CpjPlIzhgA87ULc'

// Supabase client instance (no need for a separate `initialize` function)
export const supabase = createClient(
    SUPABASE_URL as string,
    SUPABASE_ANON_KEY as string,
    {
        auth: {
            storage: AsyncStorage, // Use AsyncStorage for session persistence
            autoRefreshToken: true,
            persistSession: true,
            // This property tells the client to look for a session in the URL
            detectSessionInUrl: true,
        },
    }
);

export const supabaseAdmin = createClient(
    SUPABASE_URL as string,
    SUPABASE_SERVICE_ROLE_KEY as string,
    {
        auth: {
            storage: AsyncStorage, // Use AsyncStorage for session persistence
            autoRefreshToken: true,
            persistSession: true,
            // This property tells the client to look for a session in the URL
            detectSessionInUrl: true,
        },
    }
);
