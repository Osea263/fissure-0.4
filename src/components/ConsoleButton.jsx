import React from 'react'


const ConsoleButton = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 text-lg font-semibold rounded-sm transition duration-150 border-2 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900
                    ${disabled 
                        ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                        : 'bg-gray-800 text-white border-emerald-600 hover:bg-gray-700 active:bg-gray-600'}
                    ${className}`}
    >
        {children}
    </button>
);

export default ConsoleButton