import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { FIREBASE_CONFIG } from './constants';

let app, auth, db;

try {
    // Initialize with your project config
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Set log level during development if needed
    if (import.meta.env.DEV) {
         setLogLevel('debug');
    }

} catch (error) {
    console.error("Error initializing Firebase:", error);
}

export { auth, db, app };