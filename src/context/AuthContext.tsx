import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Linking } from 'react-native';

interface AuthContextType {
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getInitialSession();

        // Listen for real-time session changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            setSession(newSession);
        });

        // Handle initial deep link
        const handleInitialUrl = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                supabase.auth.exchangeCodeForSession(initialUrl);
            }
        };

        handleInitialUrl();

        // Listen for subsequent deep links
        const handleDeepLink = ({ url }: { url: string }) => {
            if (url) {
                supabase.auth.exchangeCodeForSession(url);
            }
        };

        Linking.addEventListener('url', handleDeepLink);

        return () => {
            authListener.subscription.unsubscribe();
            Linking.removeAllListeners('url');
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContextHandle = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};