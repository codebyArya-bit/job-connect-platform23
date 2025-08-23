import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJob();
    if (isAuthenticated) {
      checkApplicationStatus();
    }
  }, [id, isAuthenticated]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/api/jobs/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch job details');
      }
      
      setJob(response.data.data.job);
    } catch (err) {
      console.error('Error fetching job:', err);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        setError('Job not found. It may have been removed or the link is incorrect.');
      } else if (err.response?.status === 401) {
        setError('Please log in to view job details.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this job.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load job details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axios.get('/api/applications/my-applications');
      const applications = response.data.data;
      const applied = applications.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (user?.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs.');
      return;
    }

    try {
      setApplying(true);
      setError('');
      setSuccess('');
      
      const response = await axios.post(`/api/applications/apply/${id}`, {
        coverLetter: '', // You might want to add a cover letter field
        resumeUrl: '' // You might want to add resume upload
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit application');
      }
      
      setHasApplied(true);
      setSuccess('Application submitted successfully! You can track its status in your dashboard.');
    } catch (err) {
      console.error('Error applying for job:', err);
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        const message = err.response.data?.message;
        if (message?.includes('already applied')) {
          setError('You have already applied for this job.');
          setHasApplied(true);
        } else if (message?.includes('deadline')) {
          setError('The application deadline for this job has passed.');
        } else if (message?.includes('no longer accepting')) {
          setError('This job is no longer accepting applications.');
        } else {
          setError(message || 'Unable to submit application. Please check the requirements.');
        }
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Job not found. It may have been removed.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `$${min?.toLocaleString()}+`;
    if (!min) return `Up to $${max?.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job?.title}</h1>
                <div className="flex items-center text-lg text-gray-600 mb-2">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{job?.company}</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                job?.jobType === 'full-time' ? 'bg-green-100 text-green-800' :
                job?.jobType === 'part-time' ? 'bg-blue-100 text-blue-800' :
                job?.jobType === 'contract' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {job?.jobType?.charAt(0).toUpperCase() + job?.jobType?.slice(1).replace('-', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                <span>{formatSalary(job?.salaryMin, job?.salaryMax)}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Posted {formatDate(job?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Apply Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {success}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  {(error.includes('Network error') || error.includes('Server error') || error.includes('Failed to load')) && (
                    <button
                      onClick={fetchJob}
                      className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-md transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            )}

            {hasApplied ? (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">You have already applied for this job</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ready to apply?</h3>
                  <p className="text-gray-600">Submit your application for this position.</p>
                </div>
                <button
                  onClick={handleApply}
                  disabled={applying || (user?.role !== 'jobseeker' && isAuthenticated)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="p-6">
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {job?.description?.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {job?.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job?.benefits && job.benefits.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Info */}
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About {job?.company}</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{job?.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2 text-sm">Posted by:</span>
                    <ProfileAvatar 
                      user={job?.postedBy} 
                      size="sm" 
                      showName={true} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;