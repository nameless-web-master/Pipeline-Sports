import { supabase } from "../lib/supabase";

export const getCurrentSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            // console.log('Error fetching session:', error);
            return { success: false, session: null, error };
        }

        // console.log('Current session:', session);
        return { success: true, session, error: null };
    } catch (error) {
        // console.log('Failed to get current session:', error);
        return { success: false, session: null, error };
    }
}