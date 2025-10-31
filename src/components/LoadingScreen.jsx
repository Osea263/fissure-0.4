import React from 'react'


export const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gray-900 rounded-sm shadow-lg border border-gray-700 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
        <p className="text-2xl font-bold text-emerald-400">LOADING DATA...</p>
        <p className="text-lg text-gray-400 mt-2">Authenticating user and preparing the console.</p>
    </div>
);

export default LoadingScreen