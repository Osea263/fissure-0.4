import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConsoleButton from '../components/ConsoleButton';
import { CATEGORIES, SUPPORTED_LANGUAGES, REWARD_THRESHOLD, FIXED_CATEGORY } from '../lib/constants';

export const ConfigScreen = ({ config, setConfig, startTrivia, error, score, setScore, hasSubmittedWallet, gamesPlayed, maxGames }) => {
    const [confirmReset, setConfirmReset] = useState(false);
    const isLimitReached = gamesPlayed >= maxGames;

    const handleCategoryChange = (category) => {
        setConfig(prev => {
            // If the category is already selected, remove it (unless it's the last one)
            if (prev.categories.includes(category)) {
                if (prev.categories.length > 1) {
                    return { ...prev, categories: prev.categories.filter(c => c !== category) };
                }
                return prev;
            }
            // Otherwise, add it (simple single selection or multi-selection logic)
            // Let's go with SINGLE selection for simplicity, or replace the array
            return { ...prev, categories: [category] };
        });
    };

    const handleResetScore = () => {
        setScore(0);
        setConfirmReset(false);
    };

    const isStartDisabled = config.categories.length === 0 || config.numQuestions < 5;
    const QuestionCounts = [5, 10, 15, 20];

    return (
        <div className="space-y-10  text-white"> 
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6 border-b border-gray-700 pb-3 text-center"> THE ARCHITECT'S EXAMINATION</h2>
            
            {error && <p className="bg-red-900/40 text-red-400 p-3 rounded-sm border border-red-700 font-semibold">{error}</p>}

            <div className="text-center bg-gray-800 p-4 rounded-sm border border-gray-700 mb-6">
                <p className="text-xl text-gray-300 font-medium">Accumulated Score:</p>
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-500">{score} POINTS</p>
            </div>

            {score >= REWARD_THRESHOLD && !hasSubmittedWallet && (
                <div className="text-center bg-yellow-900/40 text-yellow-400 p-3 rounded-sm border border-yellow-700 font-semibold mb-6">
                    ✨ REWARD UNLOCKED! Click the SUBMIT WALLET button in the top right corner or keep playing to increase your score.
                </div>
            )}
            {score >= REWARD_THRESHOLD && hasSubmittedWallet && (
                 <div className="text-center bg-emerald-900/40 text-emerald-400 p-3 rounded-sm border border-emerald-700 font-semibold mb-6">
                    ✅ WALLET SUBMITTED! Your score of {score} points has been recorded .
                </div>
            )}
            
            <div>
                <label className="block text-xl font-semibold mb-3 text-gray-200">1. Select Category</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => {
                        // Check if this category is currently selected
                        const isSelected = config.categories.includes(cat);
                        
                        return (
                            <ConsoleButton 
                                key={cat}
                                // --- UPDATED: Enable click ---
                                onClick={() => handleCategoryChange(cat)} 
                                // --- UPDATED: Always enabled ---
                                disabled={false} 
                                className={`py-2 text-base 
                                    ${isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500' 
                                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}
                            >
                                {cat}
                            </ConsoleButton>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-xl font-semibold mb-3 text-gray-200">2. Select Difficulty:</label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {['Easy', 'Medium', 'Hard'].map(diff => (
                        <ConsoleButton 
                            key={diff}
                            onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
                            className={`py-2 text-base
                                ${config.difficulty === diff 
                                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                        >
                            {diff}
                        </ConsoleButton>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xl font-semibold mb-3 text-gray-200">3. Select Output Language:</label>
                <div className="relative">
                    <select
                        value={config.targetLanguage}
                        onChange={(e) => setConfig(prev => ({ ...prev, targetLanguage: e.target.value }))}
                        className="w-full bg-gray-800 text-white p-3 rounded-sm border border-gray-700 appearance-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xl font-semibold mb-3 text-gray-200">4. Number of Questions:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {QuestionCounts.map(count => (
                        <ConsoleButton
                            key={count}
                            onClick={() => setConfig(prev => ({ ...prev, numQuestions: count }))}
                            className={`py-2 text-base 
                                ${config.numQuestions === count
                                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                        >
                            {count}
                        </ConsoleButton>
                    ))}
                </div>
            </div>
            
            <div className="pt-4 space-y-3">
                

                {isLimitReached ? (
                    <div className="bg-red-900/40 border border-red-700 p-4 text-center rounded-sm">
                        <p className="text-red-400 font-bold text-lg">Participation Limit Reached</p>
                        <p className="text-gray-400">You have played the maximum allowed {maxGames} games.</p>
                    </div>
                ) : (
                    <ConsoleButton onClick={startTrivia} disabled={isStartDisabled} className="text-xl">
                        {isStartDisabled 
                            ? 'Select Options to Start' 
                            : `START TRIVIA (Attempt ${gamesPlayed + 1}/${maxGames})`
                        }
                    </ConsoleButton>
                )}
                {/* <div className="text-center pt-4">
                    <Link 
                        to="/walletchecker" 
                        className="text-emerald-400 hover:text-emerald-300 transition font-semibold"
                    >
                        Already submitted? Check your wallet status &rarr;
                    </Link>
                </div>     */}
            </div>
        </div>
    );
};