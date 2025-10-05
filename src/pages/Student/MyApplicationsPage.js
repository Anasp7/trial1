import React, { useState } from 'react';
import { getApplicationsByStudent, mockOpportunities } from '../../utils/mockData';

const StudentApplicationsPage = () => {
  const [applications] = useState(getApplicationsByStudent(5)); // Assuming current user is student with ID 5
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

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

  const handleFileUpload = (applicationId, file) => {
    // Here you would typically upload the file to backend
    console.log('Uploading file for application:', applicationId, file);
    alert('File upload functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage your submitted applications</p>
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
                {applications.filter(app => app.status === 'pending').length}
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
                {applications.filter(app => app.status === 'accepted').length}
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
                {applications.filter(app => app.status === 'declined').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Application History</h3>
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
                          {opportunity?.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{opportunity?.title}</h4>
                        <p className="text-gray-600">{opportunity?.company}</p>
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
                        View Resume
                      </button>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end space-y-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    
                    {application.status === 'pending' && (
                      <div className="text-sm text-gray-500">
                        Under review
                      </div>
                    )}
                    
                    {application.status === 'accepted' && (
                      <div className="text-sm text-green-600 font-medium">
                        Congratulations! Your application was accepted.
                      </div>
                    )}
                    
                    {application.status === 'declined' && (
                      <div className="text-sm text-red-600 font-medium">
                        Application was not selected this time.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* File Upload Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h6 className="text-sm font-medium text-gray-900 mb-2">Additional Documents</h6>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      id={`file-${application.id}`}
                      className="hidden"
                      onChange={(e) => handleFileUpload(application.id, e.target.files[0])}
                    />
                    <label
                      htmlFor={`file-${application.id}`}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Upload Document
                    </label>
                    <span className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</span>
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
                ? 'You haven\'t submitted any applications yet'
                : `No ${filterStatus} applications found`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplicationsPage;
