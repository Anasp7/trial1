import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const StudentOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Load opportunities and applications on component mount
  useEffect(() => {
    loadOpportunities();
    loadApplications();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOpportunities();
      setOpportunities(response.opportunities || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await apiService.getMyApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesType = filterType === 'all' || opp.type === filterType;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      case 'scholarship':
        return 'bg-green-100 text-green-800';
      case 'mentorship':
        return 'bg-purple-100 text-purple-800';
      case 'success_story':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApply = (opportunityId) => {
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    setApplyingTo(opportunity);
    setShowApplyModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, DOC, or DOCX file');
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applyingTo) return;

    try {
      await apiService.applyToOpportunity(applyingTo.id, selectedFile);
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyingTo(null);
      setSelectedFile(null);
      // Reload applications to update the UI
      loadApplications();
    } catch (error) {
      console.error('Failed to apply:', error);
      alert(`Failed to submit application: ${error.message}`);
    }
  };

  const isAlreadyApplied = (opportunityId) => {
    return applications.some(app => app.opportunity_id === opportunityId);
  };

  const getApplicationStatus = (opportunityId) => {
    const application = applications.find(app => app.opportunity_id === opportunityId);
    return application ? application.status : null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
        <p className="text-gray-600 mt-2">Discover internships, scholarships, and mentorship programs</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Opportunities
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              id="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="internship">Internships</option>
              <option value="scholarship">Scholarships</option>
              <option value="mentorship">Mentorship</option>
              <option value="success_story">Success Stories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(opportunity.type)}`}>
                {opportunity.type.replace('_', ' ').charAt(0).toUpperCase() + opportunity.type.replace('_', ' ').slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              {opportunity.company && (
                <div className="flex items-center">
                  <span className="mr-2">🏢</span>
                  <span>{opportunity.company}</span>
                </div>
              )}
              {opportunity.location && (
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{opportunity.location}</span>
                </div>
              )}
              {opportunity.duration && (
                <div className="flex items-center">
                  <span className="mr-2">⏱️</span>
                  <span>{opportunity.duration}</span>
                </div>
              )}
              {opportunity.stipend && (
                <div className="flex items-center">
                  <span className="mr-2">💰</span>
                  <span>{opportunity.stipend}</span>
                </div>
              )}
            </div>
            
            {opportunity.requirements && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Requirements:</h4>
                <p className="text-sm text-gray-600">{opportunity.requirements}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Posted: {new Date(opportunity.postedAt).toLocaleDateString()}</span>
              {opportunity.deadline && (
                <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              )}
            </div>
            
            {isAlreadyApplied(opportunity.id) ? (
              <div className="w-full">
                <div className="text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md mb-2">
                  {getApplicationStatus(opportunity.id) === 'pending' && 'Application Pending'}
                  {getApplicationStatus(opportunity.id) === 'accepted' && 'Application Accepted ✅'}
                  {getApplicationStatus(opportunity.id) === 'declined' && 'Application Declined ❌'}
                </div>
                <button
                  onClick={() => handleApply(opportunity.id)}
                  className="w-full px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                  disabled
                >
                  Already Applied
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleApply(opportunity.id)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg">No opportunities found</div>
          <div className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</div>
        </div>
      )}

      {/* Application Modal */}
      {showApplyModal && applyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apply to {applyingTo.title}
            </h3>
            
            <div className="mb-4">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF, DOC, DOCX - Max 10MB)
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplyingTo(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={!selectedFile}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOpportunitiesPage;
