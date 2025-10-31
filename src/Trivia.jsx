import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { fetchSubmissionStatus } from './api/firestore';
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



export default function App() {

    const UNLOCK_STORAGE_KEY = 'megaEthTriviaUnlocked';
    const SUBMITTED_STORAGE_KEY = 'megaEthTriviaSubmitted';


    const getInitialUnlockState = () => {
  try {
    const savedState = localStorage.getItem(UNLOCK_STORAGE_KEY);
    // If we find 'true' in storage, return true.
    // Otherwise (if it's null or 'false'), return false.
    return savedState === 'true';
  } catch (error) {
    console.error("Failed to parse unlock state from localStorage", error);
    return false; // Default to locked if anything goes wrong
  }
};

const getInitialSubmittedState = () => {
  try {
    const savedState = localStorage.getItem(SUBMITTED_STORAGE_KEY);
    return savedState === 'true'; // Returns true or false
  } catch (error) {
    return false;
  }
};

    const [isUnlocked, setIsUnlocked] = useState(getInitialUnlockState);
    const [view, setView] = useState(VIEWS.CONFIG);
    const [config, setConfig] = useState({
        categories: [FIXED_CATEGORY],
        difficulty: 'Medium',
        numQuestions: 10,
        targetLanguage: 'English',
    });
    
    
    const SCORE_STORAGE_KEY = 'megaEthTriviaScore';


 

    const getInitialScore = () => {
  try {
    const savedScore = localStorage.getItem(SCORE_STORAGE_KEY);
    // If we find a score, parse it (it's stored as a string).
    // Otherwise, default to 0.
    return savedScore ? JSON.parse(savedScore) : 0;
  } catch (error) {
    console.error("Failed to parse score from localStorage", error);
    return 0; // Default to 0 if parsing fails
  }
};
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(getInitialScore); // This score persists across games
    const [error, setError] = useState(null);
    const [showWalletPrompt, setShowWalletPrompt] = useState(false);
    
    // --- Firebase State (from custom hook) ---
    const { db, userId, isAuthReady } = useFirebaseAuth();
    const [hasSubmittedWallet, setHasSubmittedWallet] = useState(getInitialSubmittedState);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    useEffect(() => {
  // We save the new score to localStorage, converting it to a string.
  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
}, [score]);

// ... (this is your score-saving hook)
useEffect(() => {
  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
}, [score]);

// --- ADD THIS NEW HOOK ---
// This hook watches the 'isUnlocked' variable.
useEffect(() => {
  // When 'isUnlocked' becomes true (from the PasswordGate),
  // we save 'true' to localStorage.
  if (isUnlocked) {
    localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
  }
  // We don't need an 'else' block, because we only want to
  // save the 'true' state. We never want to re-lock the user.
}, [isUnlocked]);
// --- END NEW CODE ---

useEffect(() => {
        if (hasSubmittedWallet) {
            localStorage.setItem(SUBMITTED_STORAGE_KEY, 'true');
        }
    }, [hasSubmittedWallet]);

    // 1. Fetch submission status once auth is ready
    // ... in App.jsx

    // 2. Start the trivia game
    const startTrivia = async () => {
        if (IS_API_KEY_MISSING) {
            setError("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.");
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

    // 3. Handle an answer submission
    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            const points = POINTS_MAP[config.difficulty] || 0;
            setScore(prevScore => prevScore + points);
        }
        
        const isLastQuestion = currentQIndex === questions.length - 1;
        
        if (isLastQuestion) {
            setTimeout(() => setView(VIEWS.SCORE), 1500); // Wait for user to see result
        } else {
            setCurrentQIndex(prev => prev + 1);
        }
    };

    // 4. Reset game to config screen
    const resetGame = () => {
        setQuestions([]);
        setCurrentQIndex(0);
        setError(null);
        setView(VIEWS.CONFIG);
    };

    // --- Render Logic ---

    if (!isUnlocked) {
        return <PasswordGate onUnlock={setIsUnlocked} />;
    }
    
    if (!isAuthReady) {
        return (
             <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center font-sans">
                <LoadingScreen /> 
            </div>
        );
    }

    const renderBaseView = () => {
        switch (view) {
            case VIEWS.CONFIG:
                return <ConfigScreen 
                    config={config} 
                    setConfig={setConfig} 
                    startTrivia={startTrivia}
                    error={error}
                    score={score}
                    setScore={setScore} // Pass setScore for the reset button
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
                    score={score} // Show running score
                />;
            case VIEWS.SCORE:
                return <ScoreScreen 
                    score={score} 
                    resetGame={resetGame}
                />;
            default:
                setView(VIEWS.CONFIG);
                return null;
        }
    };
    
    const floatingButtonClass = hasSubmittedWallet
        ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-default'
        : 'bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-800 shadow-lg';

    return (
        <div className="min-h-screen bg-gray-950 text-white flex justify-center items-start 
                       py-6 sm:py-10 px-4">
            
            {score >= REWARD_THRESHOLD && (
        <button
           onClick={() => setShowWalletPrompt(true)}
        // THIS IS THE NEW, SIMPLER LOGIC:
        disabled={hasSubmittedWallet} 
        //
        // FIX 1: I've restored your original styling classes here
        className={`fixed top-4 right-4 z-50 py-2 px-4 text-md font-bold rounded-sm transition duration-300 shadow-md ${floatingButtonClass}`}
        title={
            hasSubmittedWallet ? "Wallet address recorded." : "Submit your wallet for reward!"
        }
    >
        {/* FIX 2: I've restored your original span attributes here */}
        <span role="img" aria-label="Wallet Icon" className="mr-2">
            {hasSubmittedWallet ? '✅' : '🔗'}
        </span> 
        {hasSubmittedWallet ? 'WALLET SUBMITTED' : 'SUBMIT WALLET'}
        </button>
    )}
            
            <div className="w-full max-w-2xl bg-gray-900 
                           p-4 md:p-8 
                           rounded-sm shadow-xl border border-gray-700">
                {renderBaseView()}
            </div>
            
            {showWalletPrompt && 
                <RewardWalletModal 
                    onClose={() => setShowWalletPrompt(false)} 
                    score={score} 
                    setHasSubmittedWallet={setHasSubmittedWallet}
                    hasSubmittedWallet={hasSubmittedWallet}
                    db={db}
                    userId={userId}
                />
            }
        </div>
    );
}