import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActionCard = ({ icon, title, description, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left w-full"
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;


