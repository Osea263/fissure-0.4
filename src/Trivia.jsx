import React, { useState, useEffect } from 'react';
// --- IMPORT SUPABASE ---
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { fetchSubmissionStatus } from './api/supabaseApi'; 
// --- END IMPORTS ---

import { fetchQuestions as apiFetchQuestions } from './api/triviaApi'; 

// Import Constants
import { VIEWS, POINTS_MAP, FIXED_CATEGORY, REWARD_THRESHOLD, IS_API_KEY_MISSING } from './lib/constants';

// Import Components and Screens
import { PasswordGate } from './components/PasswordGate';
import { LoadingScreen } from './components/LoadingScreen';
import { RewardWalletModal } from './components/RewardWalletModal';
import { ConfigScreen } from './screens/ConfigScreen';
import { GameScreen } from './screens/GameScreen';
import { ScoreScreen } from './screens/ScoreScreen';

// --- State & Storage (No changes here) ---
const SCORE_STORAGE_KEY = 'megaEthTriviaScore';
const getInitialScore = () => {
  try {
    const savedScore = localStorage.getItem(SCORE_STORAGE_KEY);
    return savedScore ? JSON.parse(savedScore) : 0;
  } catch (error) {
    return 0;
  }
};
const UNLOCK_STORAGE_KEY = 'megaEthTriviaUnlocked';
const getInitialUnlockState = () => {
  try {
    const savedState = localStorage.getItem(UNLOCK_STORAGE_KEY);
    return savedState === 'true';
  } catch (error) {
    return false;
  }
};


export default function App() {
    const [isUnlocked, setIsUnlocked] = useState(getInitialUnlockState);
    const [view, setView] = useState(VIEWS.CONFIG);
    const [config, setConfig] = useState({
        categories: [FIXED_CATEGORY],
        difficulty: 'Medium',
        numQuestions: 10,
        targetLanguage: 'English',
    });
    
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(getInitialScore); 
    const [error, setError] = useState(null);
    const [showWalletPrompt, setShowWalletPrompt] = useState(false);
    
    // --- USE SUPABASE AUTH ---
    const { supabase, userId, isAuthReady, authError, signInAsGuest } = useSupabaseAuth();
    
    // --- SUPABASE STATE ---
    const [hasSubmittedWallet, setHasSubmittedWallet] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true); 

    // --- useEffects (No changes here) ---
    useEffect(() => {
      localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
    }, [score]);
    
    useEffect(() => {
        if (isUnlocked) {
            localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
        }
    }, [isUnlocked]);

    // --- SUPABASE SUBMISSION CHECK ---
    // This hook now checks Supabase for the user's submission status
    useEffect(() => {
        if (isAuthReady && authError) {
            setError(`Authentication failed: ${authError}`);
            setIsCheckingStatus(false);
            return;
        }
        
        // Only run if we are unlocked, auth is ready, and we have a REAL userId
        if (isUnlocked && isAuthReady && supabase && userId) {
            setIsCheckingStatus(true);
            fetchSubmissionStatus(supabase, userId)
                .then(status => {
                    setHasSubmittedWallet(status);
                })
                .catch(err => {
                    console.error("Failed to check submission status:", err);
                    setError("Failed to check wallet status. (DB permissions error?)");
                })
                .finally(() => {
                    setIsCheckingStatus(false);
                });
                
        } else if (isAuthReady) {
            // App is ready, but user is not logged in or unlocked
            setIsCheckingStatus(false);
        }
    }, [isUnlocked, isAuthReady, supabase, userId, authError, setError]);

    // --- NEW HANDLE UNLOCK ---
    // This is called by PasswordGate.
    const handleUnlock = async () => {
        const authSuccess = await signInAsGuest();
        if (authSuccess) {
            setIsUnlocked(true); // This unlocks the UI
        }
        return authSuccess;
    };
    
    // --- UNCHANGED FUNCTIONS (startTrivia, handleAnswer, resetGame, renderBaseView) ---
    const startTrivia = async () => {
        if (IS_API_KEY_MISSING) {
            setError("API key is missing. Please add VITE_GEMINI_API_KEY to your env.local file");
            return;
        }
        setView(VIEWS.LOADING);
        setError(null);
        try {
            const fetchedQuestions = await apiFetchQuestions(config);
            setQuestions(fetchedQuestions);
            setView(VIEWS.GAME);
        } catch (err) {
            console.error("Trivia Generation Error:", err);
            setError(`Failed to generate questions. Error: ${err.message}. Please try again.`);
            setView(VIEWS.CONFIG);
        }
    };

    const handleAnswer = (isCorrect) => {
        const points = POINTS_MAP[config.difficulty] || 0;
        if (isCorrect) {
            setScore(prevScore => prevScore + points);
        }
        if (currentQIndex < questions.length - 1) {
            setTimeout(() => setCurrentQIndex(prev => prev + 1), 1500); // Wait for feedback
        } else {
            setTimeout(() => setView(VIEWS.SCORE), 1500);
        }
    };

    const resetGame = () => {
        setQuestions([]);
        setCurrentQIndex(0);
        setError(null);
        setView(VIEWS.CONFIG);
    };

    const renderBaseView = () => {
        switch (view) {
            case VIEWS.CONFIG:
                return <ConfigScreen 
                    config={config} 
                    setConfig={setConfig} 
                    startTrivia={startTrivia}
                    error={error}
                    score={score}
                    setScore={setScore}
                    hasSubmittedWallet={hasSubmittedWallet} 
                />;
            case VIEWS.LOADING:
                return <LoadingScreen />;
            case VIEWS.GAME:
                return <GameScreen 
                    questions={questions}
                    currentQIndex={currentQIndex}
                    handleAnswer={handleAnswer}
                    config={config}
                    score={score}
                />;
            case VIEWS.SCORE:
                return <ScoreScreen 
                    score={score} 
                    totalQuestions={questions.length} 
                    resetGame={resetGame}
                />;
            default:
                return <ConfigScreen 
                    config={config} 
                    setConfig={setConfig} 
                    startTrivia={startTrivia}
                    error={error}
                    score={score}
                    setScore={setScore}
                    hasSubmittedWallet={hasSubmittedWallet} 
                />;
        }
    };
    
    // --- RENDER LOGIC ---

    if (!isUnlocked) {
        // We pass the new handleUnlock function
        return <PasswordGate onUnlock={handleUnlock} authError={authError} />;
    }
    
    // User is unlocked, but we wait for auth to be ready
    if (!isAuthReady) {
        return (
             <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center font-sans">
                <LoadingScreen /> 
            </div>
        );
    }
    
    // If we're here, user is unlocked AND auth is ready
    const floatingButtonClass = hasSubmittedWallet
        ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-default'
        : 'bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-800 shadow-lg';

    return (
        <div className="min-h-screen bg-gray-950 text-white flex justify-center items-start py-6 sm:py-10 px-4 font-sans">
            
            {score >= REWARD_THRESHOLD && (
                <button
                    onClick={() => setShowWalletPrompt(true)}
                    // This logic is now robust
                    disabled={hasSubmittedWallet || isCheckingStatus}
                    className={`fixed top-4 right-4 z-50 py-2 px-4 text-md font-bold rounded-sm transition duration-300 shadow-md ${floatingButtonClass}`}
                    title={
                        isCheckingStatus ? "Checking submission status..." :
                        hasSubmittedWallet ? "Wallet address recorded." : "Submit your wallet for reward!"
                    }
                >
                    <span role="img" aria-label="Wallet Icon" className="mr-2">
                        {isCheckingStatus ? '...' : hasSubmittedWallet ? '✅' : '🔗'}
                    </span> 
                    {isCheckingStatus ? 'CHECKING...' : hasSubmittedWallet ? 'WALLET SUBMITTED' : 'SUBMIT WALLET'}
                </button>
            )}
            
            <div className="w-full max-w-2xl bg-gray-900 p-4 md:p-8 rounded-sm shadow-xl border border-gray-700">
                {renderBaseView()}
            </div>
            
            {showWalletPrompt && 
                <RewardWalletModal 
                    onClose={() => setShowWalletPrompt(false)} 
                    score={score} 
                    setHasSubmittedWallet={setHasSubmittedWallet}
                    hasSubmittedWallet={hasSubmittedWallet}
                    supabase={supabase} // Pass Supabase client
                    userId={userId} // Pass the real userId
                />
            }
        </div>
    );
}