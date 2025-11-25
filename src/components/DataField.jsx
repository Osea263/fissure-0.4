import React from 'react';

export const DataField = ({ label, value, tooltipText }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-700 min-h-[48px]">
        
       
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {label}
            </span>
            
            
            {tooltipText && (
                <div className="relative group"> 
                    
                    
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-gray-600 text-xs text-white cursor-pointer">
                        i
                    </span>

                    
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 mb-2 w-48
                                   p-2 bg-gray-900 text-gray-300 text-xs rounded-md border border-gray-600 shadow-lg
                                   opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {tooltipText}
                    </span>
                </div>
            )}
        </div>

        
        <span className="text-sm font-semibold text-white break-all text-right ml-2">
            {value}
        </span>
    </div>
);