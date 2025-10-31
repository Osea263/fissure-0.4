import React, { useState, useCallback } from 'react';

// --- IMPORTANT ---
// We no longer import `submitWalletForReward` from firestore.js
// import { submitWalletForReward } from '../api/firestore'; 

// We import ConsoleButton since you are still using the original UI
import ConsoleButton from './ConsoleButton';


// --- New Minimalistic RewardCard ---
const RewardCard = ({ score }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-xs mx-auto mb-6 shadow-md text-white text-center font-sans">
        
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Score Recorded
        </p>
        
        <p className="text-6xl font-extrabold text-emerald-400 mt-2">
            {score}
            <span className="text-4xl text-gray-300 ml-2">pts</span>
        </p>

    </div>
);


export const RewardWalletModal = ({ onClose, score, setHasSubmittedWallet, hasSubmittedWallet, db, userId }) => {
    const [address, setAddress] = useState('');
    const [xHandle, setXHandle] = useState(''); 
    const [submissionStatus, setSubmissionStatus] = useState('Ready'); 
    const [submissionError, setSubmissionError] = useState(null);
    
    // --- THIS IS THE UPDATED FUNCTION ---
    // It is no longer 'async' and does not call Firebase.
    const handleSubmit = useCallback(() => {
        // Prevent double-click
        if (submissionStatus === 'Submitting...' || !address || !xHandle) return;

        setSubmissionStatus('Submitting...'); // 1. Set local state to "loading"
        setSubmissionError(null);

        // --- 2. Perform Local Validation ---
        if (address.length !== 42 || !address.startsWith('0x')) {
             setSubmissionError("Invalid Ethereum address format. Must be 42 characters long and start with 0x.");
             setSubmissionStatus('Ready'); // Reset status to allow retry
             return;
        }
        if (xHandle.length < 2 || !xHandle.startsWith('@')) {
            setSubmissionError("Invalid X handle format. Must start with '@' and be at least 2 characters long.");
            setSubmissionStatus('Ready'); // Reset status to allow retry
            return;
        }
        // --- End Validation ---

        
        // --- 3. If Validation Passes, Just Update the UI ---
        // We simulate a short delay to make the "Submitting..." state visible
        setTimeout(() => {
            // This updates the local UI
            setSubmissionStatus('Submission Successful!'); 
            // This updates App.jsx, which triggers the localStorage save
            setHasSubmittedWallet(true); 
        }, 500); // 0.5 second delay

    }, [db, userId, address, xHandle, score, submissionStatus, setHasSubmittedWallet]);
    // --- END OF FIX ---


    const isValidAddress = address.length === 42 && address.startsWith('0x');
    const isValidXHandle = xHandle.length > 1 && xHandle.startsWith('@');
    const isSubmitting = submissionStatus === 'Submitting...';

    const handleXHandleChange = (e) => {
        let value = e.target.value;
        if (!value.startsWith('@') && value.length > 0 && value.match(/^[a-zA-Z0-9_]+$/)) {
             value = '@' + value;
        } else if (value.startsWith('@') && value.length === 1) {
            value = '';
        }
        setXHandle(value.trim());
    };
    
    const shareText = encodeURIComponent(
        `I scored ${score} points on the MegaETH Trivia Console and proved my L2 knowledge! Test your skills and try to beat my score. @MegaETH_XYZ #MegaETH #L2`
    );
    const shareLink = `https://twitter.com/intent/tweet?text=${shareText}`;

    return (
        // Using original font-sans from your font fix
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-sans text-white"> 
            <div className="bg-gray-900 p-8 rounded-sm w-full max-w-md border-2 border-emerald-500 shadow-2xl space-y-6">
                <h3 className="text-3xl font-bold text-emerald-400 border-b border-gray-700 pb-2">
                    REWARD CLAIM PROTOCOL
                </h3>
                
                {/* This is the new minimalistic card */}
                <RewardCard score={score} />

                {submissionStatus === 'Submission Successful!' || hasSubmittedWallet ? (
                    <>
                        <p className="text-xl text-emerald-400 font-semibold">
                            ✅ Submission Recorded!
                        </p>
                        <p className="text-gray-400 text-sm">
                            Your details have been successfully recorded in this session.
                        </p>
                        <a 
                            href={shareLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full inline-block text-center py-3 px-4 text-lg font-semibold rounded-sm transition duration-150 border-2 
                                       bg-blue-600 text-white border-blue-700 hover:bg-blue-500 hover:border-blue-600"
                        >
                            Share Score on X 🚀
                        </a>
                        <ConsoleButton 
                            onClick={onClose} 
                            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                        >
                            Close Console
                        </ConsoleButton>
                    </>
                ) : (
                    <>
                        <p className="text-lg text-gray-200">
                            Submit your EVM wallet address and X Handle. This action can only be completed **once** per user.
                        </p>
                        
                        <input
                            type="text"
                            placeholder="Enter Wallet Address (0x...)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full bg-gray-800 text-white p-3 rounded-sm border border-gray-700 focus:ring-2 focus:ring-emerald-500 transition"
                        />
                         <input
                            type="text"
                            placeholder="Enter X Handle (@username)"
                            value={xHandle}
                            onChange={handleXHandleChange}
                            disabled={isSubmitting}
                            className="w-full bg-gray-800 text-white p-3 rounded-sm border border-gray-700 focus:ring-2 focus:ring-emerald-500 transition"
                        />
                        
                        {submissionError && (
                            <p className="text-red-500 font-semibold text-sm bg-red-900/30 p-2 rounded-sm border border-red-700 font-sans">
                                Error: {submissionError}
                            </p>
                        )}
                        {isSubmitting && (
                            <div className="flex items-center space-x-2 text-emerald-400">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-emerald-500"></div>
                                <p className="text-sm font-semibold">{submissionStatus}</p>
                            </div>
                        )}
                        
                        <div className="flex space-x-4 pt-2">
                            <ConsoleButton 
                                onClick={handleSubmit} 
                                disabled={!isValidAddress || !isValidXHandle || isSubmitting}
                                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-800 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Submit Wallet & Handle'}
                            </ConsoleButton>
                            <ConsoleButton 
                                onClick={onClose} 
                                disabled={isSubmitting}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 disabled:opacity-50"
                            >
                                Cancel
                            </ConsoleButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
