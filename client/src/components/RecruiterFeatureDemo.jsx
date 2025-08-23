import React from 'react';
import { UserCircleIcon, StarIcon } from '@heroicons/react/24/solid';

const RecruiterFeatureDemo = () => {
  const mockRecruiter = {
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    role: 'recruiter'
  };

  const mockJobSeeker = {
    name: 'John Smith',
    email: 'john@email.com',
    role: 'job_seeker'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
        🎯 Recruiter Profile Features
      </h3>
      
      {/* Recruiter Profile Demo */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">✨ Recruiter Profile:</h4>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <UserCircleIcon 
              className="h-12 w-12 text-yellow-600 recruiter-glow recruiter-pulse" 
            />
            <StarIcon className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 recruiter-badge-glow" />
          </div>
          <div>
            <p className="recruiter-name font-medium">{mockRecruiter.name}</p>
            <p className="text-xs text-yellow-600 font-medium">🏷️ Verified Recruiter</p>
          </div>
        </div>
      </div>

      {/* Job Seeker Profile Demo */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">👤 Regular User Profile:</h4>
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="h-12 w-12 text-gray-400" />
          <div>
            <p className="font-medium text-gray-800">{mockJobSeeker.name}</p>
            <p className="text-xs text-gray-500">Job Seeker</p>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">✨</span>
          <span>Golden glowing profile icons</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">⭐</span>
          <span>Star badges on recruiter profiles</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">🏷️</span>
          <span>"Verified Recruiter" labels</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">🌈</span>
          <span>Gradient text for recruiter names</span>
        </div>
      </div>
    </div>
  );
};

export default RecruiterFeatureDemo;