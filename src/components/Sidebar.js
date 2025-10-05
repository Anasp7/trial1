import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userRole, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getMenuItems = () => {
    const commonItems = [
      { name: 'Profile', path: `/${userRole}/profile`, icon: '👤' },
    ];

    if (userRole === 'admin') {
      return [
        ...commonItems,
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Manage Users', path: '/admin/users', icon: '👥' },
      ];
    } else if (userRole === 'alumni') {
      return [
        ...commonItems,
        { name: 'Dashboard', path: '/alumni/dashboard', icon: '📊' },
        { name: 'Opportunities', path: '/alumni/opportunities', icon: '💼' },
        { name: 'Internships', path: '/alumni/internships', icon: '🎓' },
        { name: 'Scholarships', path: '/alumni/scholarships', icon: '💰' },
        { name: 'Mentorship', path: '/alumni/mentorship', icon: '🤝' },
        { name: 'Success Stories', path: '/alumni/success-stories', icon: '📈' },
        { name: 'Applications', path: '/alumni/applications', icon: '📋' },
      ];
    } else if (userRole === 'student') {
      return [
        ...commonItems,
        { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
        { name: 'Opportunities', path: '/student/opportunities', icon: '💼' },
        { name: 'Internships', path: '/student/internships', icon: '🎓' },
        { name: 'Scholarships', path: '/student/scholarships', icon: '💰' },
        { name: 'Mentorship', path: '/student/mentorship', icon: '🤝' },
        { name: 'My Applications', path: '/student/applications', icon: '📋' },
      ];
    }
    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'w-full justify-center' : ''
          }`}
        >
          <span className="text-lg">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
