import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getUserProfile } from '../hooks/useProfile'


type AppUserProfile = {
    id: string
    first_name: string | null
    last_name: string | null
    avatar: string | null
    role: string | null
    birthday: string | Date | null
    interest: string | null
    state: number | null
    local_area: number | null
}

type AuthProps = {
    user: User | null
    session: Session | null
    initialized?: boolean
    profile: AppUserProfile | null
    signOut?: () => Promise<void>
    state: boolean
    setState: React.Dispatch<React.SetStateAction<boolean>>
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
    const [profile, setProfile] = useState<AppUserProfile | null>(null);
    const [state, setState] = useState<boolean>(true);

    // helper to load profile by user id
    const loadProfile = async (userId: string) => {
        const result = await getUserProfile(userId)
        if (result?.success && result.data) {
            setProfile(result.data as AppUserProfile)
        } else {
            setProfile(null)
        }
    }

    useEffect(() => {
        // Listen for changes to authentication state
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session)

            // Only set user if there's a valid session AND user is email verified
            // For signup with email verification, user exists but session is null until email is verified
            if (session?.user) {
                setUser(session.user)
                await loadProfile(session.user.id)
            } else {
                setUser(null)
                setProfile(null)
            }

            setInitialized(true)
        })
        return () => {
            data.subscription.unsubscribe()
        }
    }, [state]);

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setProfile(null)
    }

    const value = {
        user,
        session,
        initialized,
        profile,
        signOut,
        state,
        setState,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
