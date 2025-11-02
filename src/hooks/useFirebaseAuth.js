import { useState, useEffect } from 'react';
import { 
    signInAnonymously,
    onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase'; // Import the initialized instances

export const useFirebaseAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [authError, setAuthError] = useState(null);

    // This effect just LISTENS for auth changes.
    // It no longer tries to sign in.
    useEffect(() => {
        if (!auth) {
            console.error("Firebase auth is not initialized.");
            setAuthError("Firebase auth is not initialized.");
            setIsAuthReady(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUserId(user.uid);
            } else {
                // User is signed out
                setUserId(null);
            }
            setIsAuthReady(true);
            setAuthError(null);
        });

        return () => unsubscribe();
    }, []);

    // This function will be called by our PasswordGate
    const signInAsGuest = async () => {
        setAuthError(null);
        try {
            const userCredential = await signInAnonymously(auth);
            // onAuthStateChanged will see the new user.
            return true; // Success!
        } catch (error) {
            console.error("Anonymous Sign-In Error:", error);
            setAuthError("Auth failed. Check network or browser privacy settings.");
            return false; // Failed
        }
    };

    // Return the auth state, db instance, and the new sign-in function
    return { auth, db, userId, isAuthReady, authError, signInAsGuest };
};

