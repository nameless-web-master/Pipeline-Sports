import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'


type AuthProps = {
    user: User | null
    session: Session | null
    initialized?: boolean
    signOut?: () => void
}

export const AuthContext = createContext<Partial<AuthProps>>({})

// Custom hook to read the context values
export function useAuth() {
    return React.useContext(AuthContext)
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>();
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        // Listen for changes to authentication state
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session)

            // Only set user if there's a valid session AND user is email verified
            // For signup with email verification, user exists but session is null until email is verified
            if (session?.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }

            setInitialized(true)
        })
        return () => {
            data.subscription.unsubscribe()
        }
    }, []);

    const value = {
        user,
        session,
        initialized,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
