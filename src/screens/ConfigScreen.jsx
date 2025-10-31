import React, { useState } from 'react';
import ConsoleButton from '../components/ConsoleButton';
import { CATEGORIES, SUPPORTED_LANGUAGES, REWARD_THRESHOLD, FIXED_CATEGORY } from '../lib/constants';

export const ConfigScreen = ({ config, setConfig, startTrivia, error, score, setScore, hasSubmittedWallet }) => {
    const [confirmReset, setConfirmReset] = useState(false);

    const handleCategoryChange = () => { /* No-op to prevent changes */ };

    const handleResetScore = () => {
        setScore(0);
        setConfirmReset(false);
    };

    const isStartDisabled = config.categories.length === 0 || config.numQuestions < 5;
    const QuestionCounts = [5, 10, 15, 20];

    return (
        <div className="space-y-8 p-6 bg-gray-900 rounded-sm shadow-lg border border-gray-700 text-white"> 
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6 border-b border-gray-700 pb-3"> THE ARCHITECT'S EXAMINATION</h2>
            
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
                <label className="block text-xl font-semibold mb-3 text-gray-200">1. Select Categories</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                        <ConsoleButton 
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            disabled={cat !== FIXED_CATEGORY}
                            className={`py-2 text-base 
                                ${cat === FIXED_CATEGORY
                                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500' 
                                : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'}`}
                        >
                            {cat} {cat === FIXED_CATEGORY ? '' : '(LOCKED)'}
                        </ConsoleButton>
                    ))}
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
                <ConsoleButton onClick={startTrivia} disabled={isStartDisabled} className="text-xl">
                    {isStartDisabled ? 'Select Options to Start' : 'START TRIVIA'}
                </ConsoleButton>
                
                {score > 0 && (
                    <div className="text-center">
                        {!confirmReset ? (
                            <button 
                                onClick={() => setConfirmReset(true)}
                                className="text-sm text-red-500 hover:text-red-400 transition duration-150"
                            >
                                Reset Persistent Score
                            </button>
                        ) : (
                            <div className="p-2 bg-red-900/30 rounded-sm border border-red-700 flex items-center justify-between">
                                <span className="text-red-400 text-sm">Are you sure? This action is permanent.</span>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={handleResetScore}
                                        className="py-1 px-3 text-sm font-semibold rounded-sm bg-red-700 hover:bg-red-600 transition text-white"
                                    >
                                        YES, RESET
                                    </button>
                                    <button 
                                        onClick={() => setConfirmReset(false)}
                                        className="py-1 px-3 text-sm font-semibold rounded-sm bg-gray-700 hover:bg-gray-600 transition text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};