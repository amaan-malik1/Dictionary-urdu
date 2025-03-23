import React from 'react';

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    );
}

export default LoadingSpinner; 