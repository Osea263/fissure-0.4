import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { PUBLIC_SUBMISSIONS_COLLECTION_PATH } from '../lib/constants';


/**
 * Checks if the current user has already submitted a wallet.
 */
export const fetchSubmissionStatus = async (db, userId) => {
    if (!db || !userId) return false;

    try {
        const q = query(
            collection(db, PUBLIC_SUBMISSIONS_COLLECTION_PATH),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // Return true if submitted, false otherwise
    } catch (error) {
        console.error("Error fetching submission status:", error);
        return false; // Assume not submitted on error
    }
};

/**
 * Submits the user's wallet and X handle to Firestore.
 */
export const submitWalletForReward = async (db, userId, walletAddress, xHandle, score) => {
    // Validation
    if (walletAddress.length !== 42 || !walletAddress.startsWith('0x')) {
         throw new Error("Invalid Ethereum address format. Must be 42 characters long and start with 0x.");
    }
    if (xHandle.length < 2 || !xHandle.startsWith('@')) {
        throw new Error("Invalid X handle format. Must start with '@' and be at least 2 characters long.");
    }
    if (!db || !userId) {
        throw new Error("Database connection not ready. Please try refreshing.");
    }

    // Try to add the document
    try {
        const docRef = await addDoc(collection(db, PUBLIC_SUBMISSIONS_COLLECTION_PATH), {
            userId: userId,
            walletAddress: walletAddress,
            xHandle: xHandle,
            score: score,
            timestamp: serverTimestamp()
        });
        return docRef.id; // Return doc ID on success
    } catch (error) {
        console.error("Submission Error:", error);
        throw new Error(`Submission failed: ${error.message}`);
    }
};