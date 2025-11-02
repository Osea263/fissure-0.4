import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import the initialized client

export const useSupabaseAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [authError, setAuthError] = useState(null);

    // This effect listens for auth changes
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const user = session?.user;
            if (user) {
                setUserId(user.id);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
            setAuthError(null);
        });

        // Check the initial session
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);
            }
            setIsAuthReady(true);
        })();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // This function will be called by PasswordGate
    const signInAsGuest = async () => {
        setAuthError(null);
        try {
            // Sign in anonymously (Supabase treats this as a guest)
            // If you want to use email/password or magic links, you'd change this.
            // For anonymous, we can use signInWithOtp with a dummy email, or just manage a guest session.
            // Let's stick to the anonymous sign-in flow.
            const { error } = await supabase.auth.signInAnonymously();
            
            if (error) throw error;
            return true; // Success!
        } catch (error) {
            console.error("Anonymous Sign-In Error:", error);
            setAuthError("Auth failed. Check Supabase connection or browser privacy settings.");
            return false; // Failed
        }
    };

    // Return the auth state and the sign-in function
    return { supabase, userId, isAuthReady, authError, signInAsGuest };
};