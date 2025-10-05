import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const AlumniSuccessStoriesPage = () => {
  const navigate = useNavigate();
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSuccessStories();
  }, []);

  const loadSuccessStories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyOpportunities();
      const storyOpps = response.opportunities?.filter(opp => opp.type === 'success_story') || [];
      setSuccessStories(storyOpps);
      setError(null);
    } catch (error) {
      console.error('Failed to load success stories:', error);
      setError('Failed to load success stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (story) => {
    navigate('/alumni/opportunities', { state: { editOpportunity: story } });
  };

  const handleViewDetails = (story) => {
    // For success stories, we can navigate to a details view or just show the full description
    alert(`Success Story Details:\n\n${story.description}`);
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
        <h1 className="text-3xl font-bold text-gray-900">My Success Stories</h1>
        <p className="text-gray-600 mt-2">Share your journey and inspire students</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successStories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                Success Story
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{story.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              {story.company && (
                <div><span className="font-medium">Company:</span> {story.company}</div>
              )}
              {story.category && (
                <div><span className="font-medium">Category:</span> {story.category}</div>
              )}
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Posted: {new Date(story.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => handleEdit(story)}
                className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleViewDetails(story)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {successStories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg">No success stories posted yet</div>
          <div className="text-gray-400 text-sm mt-1">Share your journey to inspire students</div>
        </div>
      )}
    </div>
  );
};

export default AlumniSuccessStoriesPage;
