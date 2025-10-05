import React, { useState } from 'react';
import { mockApplications, mockOpportunities, mockUsers } from '../../utils/mockData';

const AlumniApplicationsPage = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [filterStatus, setFilterStatus] = useState('all');

  const myApplications = applications.filter(app => 
    mockOpportunities.find(opp => opp.id === app.opportunityId)?.postedBy === 2
  );

  const filteredApplications = myApplications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

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

  const getStudentName = (studentId) => {
    const student = mockUsers.students.find(s => s.id === studentId);
    return student ? student.name : `Student ${studentId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage student applications</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {myApplications.filter(app => app.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {myApplications.filter(app => app.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-gray-900">
                {myApplications.filter(app => app.status === 'declined').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Student Applications</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredApplications.map((application) => {
            const opportunity = mockOpportunities.find(opp => opp.id === application.opportunityId);
            return (
              <div key={application.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">
                          {getStudentName(application.studentId).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {getStudentName(application.studentId)}
                        </h4>
                        <p className="text-gray-600">{opportunity?.title}</p>
                        <p className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Cover Letter:</h5>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                        {application.coverLetter}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Resume: {application.resume}</span>
                      <button className="text-primary-600 hover:text-primary-700">
                        Download Resume
                      </button>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end space-y-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(application.id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(application.id, 'declined')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {application.status !== 'pending' && (
                      <div className="text-sm text-gray-500">
                        {application.status === 'accepted' ? 'Application accepted' : 'Application declined'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No applications found</div>
            <div className="text-gray-400 text-sm mt-1">
              {filterStatus === 'all' 
                ? 'No students have applied to your opportunities yet'
                : `No ${filterStatus} applications found`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniApplicationsPage;
