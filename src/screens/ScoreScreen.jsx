import React from 'react';
import ConsoleButton from '../components/ConsoleButton';
import { REWARD_THRESHOLD } from '../lib/constants';    

export const ScoreScreen = ({ score, totalQuestions, resetGame }) => (
    <div className="text-center space-y-8 min-h-[400px] flex flex-col justify-center items-center p-6 bg-gray-900 rounded-sm shadow-lg border border-gray-700 text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white border-b border-gray-700 pb-2 mb-4">GAME ENDED</h2>
        
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <p className="text-xl md:text-3xl text-gray-200">Your Total Score:</p>
            <p className="text-4xl md:text-7xl font-extrabold my-4 text-emerald-500">
                {score} <span className="text-xl md:text-4xl text-gray-400">POINTS</span>
            </p>
            <p className=" text-left text-gray-400">
                {score >= REWARD_THRESHOLD ? "Reward threshold reached! Click the SUBMIT WALLET button! Above Or Keep Playing To Increase Your Score (Score Carries Over!).": 
                 score > 50 ? "Solid performance! Keep scaling." : 
                 "Time to read up on ZK Rollups and MegaETH!"}
            </p>
        </div>

        <ConsoleButton onClick={resetGame} className="w-2/3 md:text-xl">
            PLAY AGAIN 
        </ConsoleButton>
    </div>
);