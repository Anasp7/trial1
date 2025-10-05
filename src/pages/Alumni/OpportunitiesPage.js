import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const AlumniOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    company: '',
    location: '',
    duration: '',
    stipend: '',
    requirements: '',
    deadline: ''
  });

  // Load opportunities on component mount
  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyOpportunities();
      setOpportunities(response.opportunities || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing opportunity
        await apiService.updateOpportunity(editingId, formData);
        await loadOpportunities(); // Reload to get updated data
        setEditingId(null);
      } else {
        // Create new opportunity
        await apiService.createOpportunity(formData);
        await loadOpportunities(); // Reload to get new data
      }
      
      setIsCreating(false);
      setFormData({
        title: '',
        type: 'internship',
        description: '',
        company: '',
        location: '',
        duration: '',
        stipend: '',
        requirements: '',
        deadline: ''
      });
    } catch (error) {
      console.error('Failed to save opportunity:', error);
      setError('Failed to save opportunity. Please try again.');
    }
  };

  const handleEdit = (opportunity) => {
    setFormData({
      title: opportunity.title,
      type: opportunity.type,
      description: opportunity.description,
      company: opportunity.company || '',
      location: opportunity.location || '',
      duration: opportunity.duration || '',
      stipend: opportunity.stipend || '',
      requirements: opportunity.requirements || '',
      deadline: opportunity.deadline || ''
    });
    setEditingId(opportunity.id);
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await apiService.deleteOpportunity(id);
        await loadOpportunities(); // Reload to get updated data
      } catch (error) {
        console.error('Failed to delete opportunity:', error);
        setError('Failed to delete opportunity. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: '',
      type: 'internship',
      description: '',
      company: '',
      location: '',
      duration: '',
      stipend: '',
      requirements: '',
      deadline: ''
    });
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Opportunities</h1>
          <p className="text-gray-600 mt-2">Create and manage opportunities for students</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          + Create Opportunity
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter opportunity title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="internship">Internship</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="success_story">Success Story</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the opportunity..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 3 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stipend/Amount</label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., $5000/month"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <textarea
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Opportunity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunities List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Opportunities</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{opportunity.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(opportunity.type)}`}>
                      {opportunity.type.replace('_', ' ').charAt(0).toUpperCase() + opportunity.type.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {opportunity.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    {opportunity.company && (
                      <div>
                        <span className="font-medium">Company:</span> {opportunity.company}
                      </div>
                    )}
                    {opportunity.location && (
                      <div>
                        <span className="font-medium">Location:</span> {opportunity.location}
                      </div>
                    )}
                    {opportunity.duration && (
                      <div>
                        <span className="font-medium">Duration:</span> {opportunity.duration}
                      </div>
                    )}
                    {opportunity.stipend && (
                      <div>
                        <span className="font-medium">Stipend:</span> {opportunity.stipend}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <span>Posted: {new Date(opportunity.postedAt).toLocaleDateString()}</span>
                    {opportunity.deadline && (
                      <span className="ml-4">Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(opportunity)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opportunity.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {opportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No opportunities created yet</div>
            <div className="text-gray-400 text-sm mt-1">Create your first opportunity to help students</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniOpportunitiesPage;
