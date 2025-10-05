import React from 'react';
import { mockOpportunities, mockApplications } from '../../utils/mockData';
import QuickActionCard from '../../components/QuickActionCard';

const AlumniDashboard = () => {
  const myOpportunities = mockOpportunities.filter(opp => opp.postedBy === 2); // Assuming current user is alumni with ID 2
  const myApplications = mockApplications.filter(app => 
    mockOpportunities.find(opp => opp.id === app.opportunityId)?.postedBy === 2
  );

  const stats = [
    {
      title: 'My Opportunities',
      value: myOpportunities.length,
      icon: '💼',
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Total Applications',
      value: myApplications.length,
      icon: '📋',
      color: 'bg-green-500',
      change: '+5 this week'
    },
    {
      title: 'Pending Reviews',
      value: myApplications.filter(app => app.status === 'pending').length,
      icon: '⏳',
      color: 'bg-orange-500',
      change: 'Needs attention'
    },
    {
      title: 'Accepted Applications',
      value: myApplications.filter(app => app.status === 'accepted').length,
      icon: '✅',
      color: 'bg-purple-500',
      change: '+3 this month'
    }
  ];

  const recentApplications = myApplications.slice(0, 5);

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
        <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Manage your opportunities and help students succeed.</p>
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
          <QuickActionCard icon="➕" title="Post Opportunity" description="Create new opportunity" path="/alumni/opportunities/new" />
          <QuickActionCard icon="📝" title="Review Applications" description="Check pending applications" path="/alumni/applications" />
          <QuickActionCard icon="📊" title="View Analytics" description="Track your impact" path="/alumni/analytics" />
          <QuickActionCard icon="🤝" title="Mentorship" description="Guide students" path="/alumni/mentorship" />
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
                      {application.studentId === 5 ? 'A' : application.studentId === 6 ? 'B' : 'C'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {application.studentId === 5 ? 'Alice Brown' : 
                       application.studentId === 6 ? 'Bob Wilson' : 'Carol Davis'}
                    </p>
                    <p className="text-sm text-gray-600">{opportunity?.title}</p>
                    <p className="text-xs text-gray-500">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Accept
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Opportunities Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Opportunities</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Manage all →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{opportunity.title}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {opportunity.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}</span>
                <span>{new Date(opportunity.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
