import React from 'react';
import { getOpportunitiesByType } from '../../utils/mockData';

const StudentMentorshipPage = () => {
  const mentorships = getOpportunitiesByType('mentorship').filter(opp => opp.status === 'active');

  const handleApply = (mentorshipId) => {
    console.log('Applying to mentorship:', mentorshipId);
    alert('Application form would open here');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mentorship Programs</h1>
        <p className="text-gray-600 mt-2">Connect with experienced alumni for guidance and support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentorships.map((mentorship) => (
          <div key={mentorship.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{mentorship.title}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Mentorship
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{mentorship.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div><span className="font-medium">Mentor:</span> {mentorship.mentor}</div>
              <div><span className="font-medium">Duration:</span> {mentorship.duration}</div>
              <div><span className="font-medium">Focus:</span> {mentorship.focus}</div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Posted: {new Date(mentorship.postedAt).toLocaleDateString()}</span>
            </div>
            
            <button
              onClick={() => handleApply(mentorship.id)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Apply for Mentorship
            </button>
          </div>
        ))}
      </div>

      {mentorships.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg">No mentorship programs available</div>
          <div className="text-gray-400 text-sm mt-1">Check back later for new opportunities</div>
        </div>
      )}
    </div>
  );
};

export default StudentMentorshipPage;
