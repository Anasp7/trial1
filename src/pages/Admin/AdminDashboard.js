import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    admin_count: 0,
    alumni_count: 0,
    student_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminStats();
      setStats(response);
      setError(null);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: '👥',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Alumni',
      value: stats.alumni_count,
      icon: '🎓',
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Students',
      value: stats.student_count,
      icon: '📚',
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Admins',
      value: stats.admin_count,
      icon: '⚙️',
      color: 'bg-orange-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      message: 'New scholarship application from Alice Brown',
      time: '2 hours ago',
      icon: '📝'
    },
    {
      id: 2,
      type: 'opportunity',
      message: 'John Smith posted a new internship opportunity',
      time: '4 hours ago',
      icon: '💼'
    },
    {
      id: 3,
      type: 'registration',
      message: 'New alumni registration: Sarah Johnson',
      time: '6 hours ago',
      icon: '👤'
    },
    {
      id: 4,
      type: 'application',
      message: 'Bob Wilson applied for mentorship program',
      time: '8 hours ago',
      icon: '🤝'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">👥</span>
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage all users</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">📊</span>
                <div>
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">Generate platform reports</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">⚙️</span>
                <div>
                  <p className="font-medium text-gray-900">Platform Settings</p>
                  <p className="text-sm text-gray-600">Configure platform settings</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all activities →
            </button>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-900">Success Rate</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">85%</p>
            <p className="text-sm text-gray-600">Applications accepted</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900">Response Time</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">2.4h</p>
            <p className="text-sm text-gray-600">Average response time</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⭐</span>
            </div>
            <h4 className="font-semibold text-gray-900">Satisfaction</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">4.8/5</p>
            <p className="text-sm text-gray-600">User satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
