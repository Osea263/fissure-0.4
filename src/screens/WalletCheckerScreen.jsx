import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { checkWallet } from '../api/supabaseApi';
import { CertificateDisplay } from '../components/CertificateDisplay';
import ConsoleButton from '../components/ConsoleButton'; // Use your original ConsoleButton

export const WalletCheckerScreen = () => {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async () => {
        // ... (this function logic remains the same)
        if (!address || address.length !== 42 || !address.startsWith('0x')) {
            setError('Please enter a valid EVM wallet address (0x...).');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await checkWallet(supabase, address);
            
            if (data && data.length > 0) {
                setResult(data[0]); 
            } else {
                setError('No submission found for this wallet address.');
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        
        <div className="min-h-screen bg-gray-950 text-white flex justify-center items-start py-6 sm:py-10 px-4 font-sans">
            
            <div className="w-full max-w-2xl border-gray-700 p-4 md:p-8 rounded-sm shadow-xl border  space-y-6">
                
                <h2 className="text-xl md:text-3xl font-bold text-emerald-400 border-b border-gray-700 pb-3">
                    WALLET SUBMISSION CHECKER
                </h2>

                <p className="text-gray-400">
                    Enter your EVM wallet address to check if your submission
                    and score have been recorded in the database.
                </p>

                <input
                    type="text"
                    placeholder="Enter Wallet Address (0x...)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                    // Use the original dark mode input style
                    className="w-full p-3 rounded-sm bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500 transition"
                />

                
                <ConsoleButton 
                    onClick={handleCheck} 
                    disabled={isLoading}
                    className="w-full" 
                >
                    {isLoading ? 'Checking...' : 'Check Wallet Status'}
                </ConsoleButton>

                {error && (
                    
                    <p className="bg-red-900/40 text-red-400 p-3 rounded-sm border border-red-700 font-semibold">
                        {error}
                    </p>
                )}

                {result && (
                    <div className="pt-4">
                        <CertificateDisplay
                            id={result.found_id}
                            handle={result.found_x_handle}
                            score={result.found_score}
                        />
                    </div>
                )}

                <div className="text-center pt-4">
                    <Link 
                        to="/" 
                        className="text-emerald-400 hover:text-emerald-300 transition font-semibold"
                    >
                        &larr; Back to Trivia App
                    </Link>
                </div>

            </div>
        </div>
    );
};