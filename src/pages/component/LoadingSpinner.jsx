// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-8 w-8 rounded-full animate-spin border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;