import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, BriefcaseIcon, UserIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Handle specific registration errors
        const message = result.message || 'Registration failed';
        if (message.includes('already exists') || message.includes('already registered')) {
          setError('An account with this email already exists. Please use a different email or try logging in.');
        } else if (message.includes('validation') || message.includes('required')) {
          setError('Please fill in all required fields correctly.');
        } else if (message.includes('password')) {
          setError('Password does not meet requirements. Please ensure it is at least 6 characters long.');
        } else if (message.includes('email')) {
          setError('Please enter a valid email address.');
        } else if (message.includes('network') || message.includes('Network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(message);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join JobConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to get started
          </p>
        </div>
        
        {!selectedRole && (
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('jobseeker');
                  setFormData({ ...formData, role: 'jobseeker' });
                }}
                className="group relative p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <UserIcon className="h-12 w-12 text-primary-600 mb-3 group-hover:text-primary-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Seeker</h3>
                  <p className="text-sm text-gray-600">Find your dream job and connect with top employers</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('recruiter');
                  setFormData({ ...formData, role: 'recruiter' });
                }}
                className="group relative p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <BriefcaseIcon className="h-12 w-12 text-primary-600 mb-3 group-hover:text-primary-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Employer</h3>
                  <p className="text-sm text-gray-600">Post jobs and find the perfect candidates</p>
                </div>
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        )}
        
        {selectedRole && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {selectedRole === 'jobseeker' ? (
                  <UserIcon className="h-6 w-6 text-primary-600 mr-2" />
                ) : (
                  <BriefcaseIcon className="h-6 w-6 text-primary-600 mr-2" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  Sign up as {selectedRole === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('');
                  setFormData({ ...formData, role: '' });
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="ml-4 text-sm text-red-700 hover:text-red-800 underline focus:outline-none"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>


            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
            </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;