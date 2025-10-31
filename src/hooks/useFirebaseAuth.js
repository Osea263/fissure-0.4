import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase'; // Import the initialized instances

export const useFirebaseAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        if (!auth) {
            console.error("Firebase auth is not initialized.");
            setIsAuthReady(true); // Allow app to proceed, though auth-dependent features will fail
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                try {
                    // Sign in anonymously if no user is found
                    const anonUser = await signInAnonymously(auth);
                    setUserId(anonUser.user.uid);
                } catch (error) {
                    console.error("Firebase Anonymous Auth Error:", error);
                    // Fallback to a random ID if auth fails completely
                    setUserId(crypto.randomUUID());
                }
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // Return the auth state and the db instance
    return { auth, db, userId, isAuthReady };
};