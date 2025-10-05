import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import apiService from '../../services/api';
import { profileApi } from '../../services/profileApi';

const AlumniApplicationsPage = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
    loadOpportunities();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlumniApplications();
      setApplications(response.applications || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunities = async () => {
    try {
      const response = await apiService.getMyOpportunities();
      setOpportunities(response.opportunities || []);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    }
  };

  const myApplications = applications;

  const filteredApplications = myApplications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  // Fetch unique student profiles for displayed applications
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const uniqueIds = Array.from(new Set((applications || []).map(a => a.student_id)));
        if (uniqueIds.length === 0) return;
        const results = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const { profile } = await profileApi.getProfile('student', id);
              return { id, profile };
            } catch (e) {
              return { id, profile: null };
            }
          })
        );
        const map = {};
        results.forEach(({ id, profile }) => {
          if (profile) {
            map[id] = {
              id,
              name: profile.name,
              email: profile.email,
              profile_pic: profile.profile_pic,
            };
          }
        });
        setStudentMap(map);
      } catch (err) {
        console.error('Failed to load student profiles', err);
      }
    };
    fetchStudents();
  }, [applications]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await apiService.updateApplicationStatus(applicationId, newStatus);
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Failed to update application status:', error);
      alert('Failed to update application status. Please try again.');
    }
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

  const getStudent = (studentId) => studentMap[studentId];

  const getOpportunityTitle = (opportunityId) => {
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    return opportunity ? opportunity.title : `Opportunity ${opportunityId}`;
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

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
            const student = getStudent(application.student_id);
            const initials = student?.name ? student.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase() : String(application.student_id).charAt(0).toUpperCase();
            return (
              <div key={application.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      {student?.profile_pic ? (
                        <img src={student.profile_pic} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-700">{initials}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {student ? (
                            <Link to={`/students/${student.id}`} className="hover:underline">
                              {student.name}
                            </Link>
                          ) : (
                            <Link to={`/students/${application.student_id}`} className="hover:underline">
                              {`Student ${application.student_id}`}
                            </Link>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">{student?.email || ''}</p>
                        <p className="text-gray-600">{getOpportunityTitle(application.opportunity_id)}</p>
                        <p className="text-sm text-gray-500">
                          Applied on {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {application.resume_file && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>Resume: {application.resume_file}</span>
                        <a
                          href={apiService.getFileUrl(application.resume_file)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
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
