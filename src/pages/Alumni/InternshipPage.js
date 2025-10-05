import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const AlumniInternshipPage = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyOpportunities();
      const internshipOpps = response.opportunities?.filter(opp => opp.type === 'internship') || [];
      setInternships(internshipOpps);
      setError(null);
    } catch (error) {
      console.error('Failed to load internships:', error);
      setError('Failed to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (internship) => {
    navigate('/alumni/opportunities', { state: { editOpportunity: internship } });
  };

  const handleViewApplications = (internship) => {
    navigate('/alumni/applications', { state: { filterOpportunity: internship.id } });
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Internships</h1>
        <p className="text-gray-600 mt-2">Manage your posted internship opportunities</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Internship
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{internship.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              {internship.company && (
                <div><span className="font-medium">Company:</span> {internship.company}</div>
              )}
              {internship.location && (
                <div><span className="font-medium">Location:</span> {internship.location}</div>
              )}
              {internship.duration && (
                <div><span className="font-medium">Duration:</span> {internship.duration}</div>
              )}
              {internship.stipend && (
                <div><span className="font-medium">Stipend:</span> {internship.stipend}</div>
              )}
            </div>
            
            {internship.requirements && (
              <div className="text-sm text-gray-500 mb-4">
                <div><span className="font-medium">Requirements:</span></div>
                <p className="mt-1">{internship.requirements}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Posted: {new Date(internship.created_at).toLocaleDateString()}</span>
              {internship.deadline && (
                <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
              )}
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => handleEdit(internship)}
                className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleViewApplications(internship)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Applications
              </button>
            </div>
          </div>
        ))}
      </div>

      {internships.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg">No internships posted yet</div>
          <div className="text-gray-400 text-sm mt-1">Create your first internship opportunity</div>
        </div>
      )}
    </div>
  );
};

export default AlumniInternshipPage;
