import React, { useState } from 'react';
import ConsoleButton from './ConsoleButton';
import { CORRECT_PASSWORD } from '../lib/constants';

// Accept 'authError' prop again
export const PasswordGate = ({ onUnlock, authError }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Add a loading state again
    const [isLoading, setIsLoading] = useState(false);

    // Make handleSubmit async again
    const handleSubmit = async () => {
        if (isLoading) return;

        if (password.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
            setIsLoading(true);
            setError('');
            
            // Await the onUnlock promise
            // onUnlock (which will be handleUnlock) returns true/false
            const authSuccess = await onUnlock();
            
            if (!authSuccess) {
                // If auth fails, show the error from the auth hook
                setIsLoading(false);
            }
            // If auth succeeds, the app will unmount this component
            
        } else {
            setError('ACCESS DENIED: Invalid key. Please try again.');
            setPassword('');
            setTimeout(() => setError(''), 2000);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50 p-4 font-sans text-white">
            <div className="bg-gray-900 p-6 md:p-10 rounded-sm shadow-2xl max-w-sm w-full border-4 border-emerald-500 space-y-6 text-center">
                <h2 className="text-3xl font-bold text-emerald-400">Fissure 0.4 </h2>
                <p className="text-gray-400">Enter the L2 authentication key to access the console.</p>
                
                <input 
                    type="password" 
                    placeholder="Enter Secret Key" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="w-full p-3 rounded-sm bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500 transition" 
                />
                
                <ConsoleButton onClick={handleSubmit} disabled={isLoading}>
                    {/* Show loading state */}
                    {isLoading ? 'Authenticating...' : 'Authenticate'}
                </ConsoleButton>

                {/* Show password error OR auth error from the hook */}
                <p className="text-red-500 font-semibold h-4">
                    {error || authError}
                </p>
            </div>
        </div>
    );
};

export default PasswordGate;