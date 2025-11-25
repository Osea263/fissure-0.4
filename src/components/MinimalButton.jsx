import React from 'react';

export const MinimalButton = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 text-lg font-semibold rounded-md transition duration-150 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                    ${disabled 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'}
                    ${className}`}
    >
        {children}
    </button>
);