import { supabase, supabaseAdmin } from "../lib/supabase";
import { AuthApiError } from "@supabase/supabase-js";

// Import Types of several Variables
import type { checkEmailPropsType, DatabaseState } from "../types/props";
import { useCallback, useState } from "react";
import { useDeepLinkListener } from "./useDeepLinkListner";

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.log('Error fetching user:', error);
            return { success: false, user: null, error };
        }

        console.log('Current user:', user);
        return { success: true, user, error: null };
    } catch (error) {
        console.log('Failed to get current user:', error);
        return { success: false, user: null, error };
    }
}



export const getTokenFromUrl = async (url: string): Promise<Record<string, string>> => {
    try {
        const hashIndex = url.indexOf('#');
        if (hashIndex === -1) return {};

        const hash = url.substring(hashIndex + 1);
        return hash.split('&').reduce((acc: Record<string, string>, part: string) => {
            const [key, value] = part.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {} as Record<string, string>);

    } catch (error) {
        console.log('Failed to get token from url:', error);
        return {} as Record<string, string>;
    }
}

export const signUp = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // This is the deep link URL that the user will be redirected to
                // after clicking the confirmation link in their email.
                emailRedirectTo: 'pipelineSports://OnBoardingMain'
            }
        });

        // Handle any specific Supabase authentication API errors
        if (error) {
            if (error instanceof AuthApiError) {
                if (error.message.includes('User already registered')) {
                    // This error message is based on Supabase's behavior when email confirmations are enabled.
                    return { success: false, error: 'A user with this email already exists.' };
                }
            }
            return { success: false, error: error.message };
        }

        // A fully successful sign-up returns a user object.
        // If email confirmation is enabled, a user is returned but the session is null initially.
        // This is handled by the AuthContext, which navigates to VerifyEmailScreen.
        if (data.user) {
            return { success: true, user: data.user };
        }

        // Fallback for unexpected scenarios
        return { success: false, error: 'An unexpected sign-up error occurred.' };

    } catch (error) {
        // Handle unexpected or network-level errors
        const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred during sign up.';
        return { success: false, error: errorMessage };
    }
}

export const signInWithPassword = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase
            .auth
            .signInWithPassword({ email, password });

        return error ? false : true;

    } catch (error) {
        return false;
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log('Sign out error:', error);
            throw error;
        }

        console.log('Sign out successful');
        return { success: true, error: null };
    } catch (error) {
        console.log('Sign out failed:', error);
        return { success: false, error };
    }
}

export const isAuthenticated = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.log('Error checking authentication:', error);
            return { success: false, isAuthenticated: false, error };
        }

        const authenticated = !!user;
        console.log('Authentication status:', authenticated);
        return { success: true, isAuthenticated: authenticated, error: null };
    } catch (error) {
        console.log('Failed to check authentication:', error);
        return { success: false, isAuthenticated: false, error };
    }
}

export const resetPassword = async (email: string) => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'pipelineSports://ResetPassowrd', // You'll need to set this up
        });

        if (error) {
            console.log('Password reset error:', error);
            throw error;
        }

        console.log('Password reset email sent:', data);
        return { success: true, data, error: null };
    } catch (error) {
        console.log('Password reset failed:', error);
        return { success: false, data: null, error };
    }
}

export const sendResetPasswordEmail = async (email: string) => {
    try {
        const emailExist = await checkEmailExist(email);
        if (emailExist === 'signup')
            return null;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'pipelineSports://ResetPassowrd',
        });

        return error ? error : true;
    } catch (error) {
        return error;
    }
}

/**
 * Update the currently authenticated user's password.
 * Requires a valid session (established via reset link or login).
 */
export const updatePassword = async (newPassword: string) => {
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return error ? false : true;
    } catch {
        return false;
    }
}

export const sendEmailVerification = async (email: string, redirectTo: string = 'pipelineSports://OnBoardingMain') => {
    try {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: redirectTo,
            }
        })

        return error ? error : true;
    }
    catch (e) {
        return e;
    }
}


/**
 * Determine whether an email already exists in Supabase auth.
 * Returns:
 * - 'login'  → user exists and email verified
 * - 'verify'  → user exists but email not verified
 * - 'signup' → user does not exist
 * - 'error'  → unexpected failure
 *
 * Note: This approach tries to sign in to check if the email exists and is verified.
 * For production, consider implementing a server-side endpoint.
 */
export const checkEmailExist = async (email: string): Promise<checkEmailPropsType> => {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        const userExists = users.filter(user => user.email === email);
        return userExists.length ?
            (
                userExists[0].user_metadata.email_verified ? 'login' : 'verify'
            ) :
            'signup'

    } catch (err) {
        return 'error';
    }
}


export const usePasswordResetLink = () => {
    const [sessionLoaded, setSessionLoaded] = useState(false);

    const handleLink = useCallback(async (url: string) => {
        const { access_token, refresh_token } = await getTokenFromUrl(url);

        if (access_token && refresh_token) {
            const { error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
                console.log('[Supabase] Session error:', error.message);
            } else {
                setSessionLoaded(true);
            }
        }
    }, []);

    useDeepLinkListener(handleLink);

    return { sessionLoaded };
};
