import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';

const StudentScholarshipPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [oppRes, appRes] = await Promise.all([
        apiService.getOpportunities({ type: 'scholarship' }),
        apiService.getMyApplications()
      ]);
      setOpportunities((oppRes.opportunities || []).filter(o => o.type === 'scholarship'));
      setApplications(appRes.applications || []);
      setError(null);
    } catch (e) {
      setError('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyApplied = (opportunityId) => applications.some(a => a.opportunity_id === opportunityId);
  const getStatus = (opportunityId) => {
    const a = applications.find(x => x.opportunity_id === opportunityId);
    return a ? a.status : null;
  };
  const handleApply = async (opportunityId) => {
    try {
      await apiService.applyToOpportunity(opportunityId);
      await load();
      alert('Application submitted');
    } catch (e) {
      alert(e.message || 'Failed to apply');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
        <p className="text-gray-600 mt-2">Find scholarship opportunities for financial support</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{scholarship.title}</h3>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Scholarship
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{scholarship.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div><span className="font-medium">Amount:</span> {scholarship.amount}</div>
              <div><span className="font-medium">Eligibility:</span> {scholarship.eligibility}</div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Posted: {new Date(scholarship.postedAt).toLocaleDateString()}</span>
              <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
            </div>
            
            {isAlreadyApplied(scholarship.id) ? (
              <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md">
                {getStatus(scholarship.id) === 'pending' && 'Application Pending'}
                {getStatus(scholarship.id) === 'accepted' && 'Application Accepted ✅'}
                {getStatus(scholarship.id) === 'declined' && 'Application Declined ❌'}
              </div>
            ) : (
              <button
                onClick={() => handleApply(scholarship.id)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg">No scholarships available</div>
          <div className="text-gray-400 text-sm mt-1">Check back later for new opportunities</div>
        </div>
      )}
    </div>
  );
};

export default StudentScholarshipPage;
