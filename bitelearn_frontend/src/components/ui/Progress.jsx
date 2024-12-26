import React from 'react';

const Progress = ({ value, className }) => {
  return (
    <div className={`relative pt-1 ${className}`}>
      <div className="flex mb-2 items-center justify-between">
        <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
          {value}%
        </span>
      </div>
      <div className="flex">
        <div
          className="relative flex flex-col text-center whitespace-nowrap text-white bg-teal-500 rounded"
          style={{ width: `${value}%` }}
        >
          <div className="h-2 w-full bg-teal-400 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
