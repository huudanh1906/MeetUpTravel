import React from 'react';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'orange' | 'gray';
  className?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  color = 'blue',
  className = '',
  children
}) => {
  if (!open) return null;

  // Define color variations
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    orange: 'bg-orange-50 text-orange-800 border-orange-200',
    gray: 'bg-gray-50 text-gray-800 border-gray-200'
  };

  return (
    <div className={`relative px-4 py-3 border ${colorStyles[color]} ${className}`} role="alert">
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert; 