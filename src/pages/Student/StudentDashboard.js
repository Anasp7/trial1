import React from 'react';
import { mockOpportunities, getApplicationsByStudent } from '../../utils/mockData';
import QuickActionCard from '../../components/QuickActionCard';

const StudentDashboard = () => {
  const myApplications = getApplicationsByStudent(5); // Assuming current user is student with ID 5
  const availableOpportunities = mockOpportunities.filter(opp => opp.status === 'active');

  const stats = [
    {
      title: 'Available Opportunities',
      value: availableOpportunities.length,
      icon: '💼',
      color: 'bg-blue-500',
      change: 'New opportunities available'
    },
    {
      title: 'My Applications',
      value: myApplications.length,
      icon: '📋',
      color: 'bg-green-500',
      change: 'Applications submitted'
    },
    {
      title: 'Pending Reviews',
      value: myApplications.filter(app => app.status === 'pending').length,
      icon: '⏳',
      color: 'bg-orange-500',
      change: 'Awaiting response'
    },
    {
      title: 'Accepted Applications',
      value: myApplications.filter(app => app.status === 'accepted').length,
      icon: '✅',
      color: 'bg-purple-500',
      change: 'Congratulations!'
    }
  ];

  const recentApplications = myApplications.slice(0, 3);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Discover opportunities and track your applications.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard icon="🔍" title="View Opportunities" description="Find internships & scholarships" path="/student/opportunities" />
          <QuickActionCard icon="📝" title="My Applications" description="Check application status" path="/student/applications" />
          <QuickActionCard icon="👤" title="Profile" description="Update your profile" path="/student/profile" />
          <QuickActionCard icon="🤝" title="Mentorship" description="Connect with alumni" path="/student/mentorship" />
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all →
          </button>
        </div>
        
        <div className="space-y-4">
          {recentApplications.map((application) => {
            const opportunity = mockOpportunities.find(opp => opp.id === application.opportunityId);
            return (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {opportunity?.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{opportunity?.title}</p>
                    <p className="text-sm text-gray-600">{opportunity?.company}</p>
                    <p className="text-xs text-gray-500">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Featured Opportunities</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableOpportunities.slice(0, 3).map((opportunity) => (
            <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{opportunity.title}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  opportunity.type === 'internship' ? 'bg-blue-100 text-blue-800' :
                  opportunity.type === 'scholarship' ? 'bg-green-100 text-green-800' :
                  opportunity.type === 'mentorship' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{opportunity.company}</span>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
