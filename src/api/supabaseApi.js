/**
 * Checks if the current user has already submitted a wallet.
 */
export const fetchSubmissionStatus = async (supabase, userId) => {
    if (!supabase || !userId) return false;

    try {
        // Select a single column, which is more efficient.
        // .maybeSingle() returns one record or null, without throwing an error if empty.
        const { data, error } = await supabase
            .from('trivia_submissions')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data !== null; // Return true if data exists, false otherwise
    } catch (error) {
        console.error("Error fetching submission status:", error);
        return false; // Assume not submitted on error
    }
};

/**
 * Submits the user's wallet and X handle to Supabase.
 */
export const submitWalletForReward = async (supabase, userId, walletAddress, xHandle, score) => {
    // Validation
    if (walletAddress.length !== 42 || !walletAddress.startsWith('0x')) {
         throw new Error("Invalid Ethereum address format. Must be 42 characters long and start with 0x.");
    }
    if (xHandle.length < 2 || !xHandle.startsWith('@')) {
        throw new Error("Invalid X handle format. Must start with '@' and be at least 2 characters long.");
    }
    if (!supabase || !userId) {
        throw new Error("Database connection not ready. Please try refreshing.");
    }

    // Try to insert the new row
    try {
        const { error } = await supabase
            .from('trivia_submissions')
            .insert({
                user_id: userId,
                wallet_address: walletAddress,
                x_handle: xHandle,
                score: score
            });

        if (error) {
            // This will catch the 'unique constraint' violation
            if (error.code === '23505') { // Postgres code for unique violation
                throw new Error("You have already submitted your wallet.");
            }
            throw error;
        }

        return true; // Return true on success
    } catch (error) {
        console.error("Submission Error:", error);
        throw new Error(`Submission failed: ${error.message}`);
    }
};