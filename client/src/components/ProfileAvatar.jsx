import React from 'react';
import { UserCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ProfileAvatar = ({ user, size = 'md', showName = true }) => {
  const isRecruiter = user?.role === 'recruiter';
  
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const containerSizeClasses = {
    sm: 'relative',
    md: 'relative',
    lg: 'relative',
    xl: 'relative'
  };

  return (
    <div className={`flex items-center space-x-2 ${containerSizeClasses[size]} ${
      isRecruiter ? 'recruiter-profile' : ''
    }`}>
      <div className="relative">
        {/* Glowing effect for recruiters */}
        {isRecruiter && (
          <>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 recruiter-glow blur-sm"></div>
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 recruiter-pulse blur-xs" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* Profile Icon */}
        <div className="relative">
          <UserCircleIcon 
            className={`${sizeClasses[size]} ${
              isRecruiter 
                ? 'text-yellow-500 drop-shadow-lg filter' 
                : 'text-gray-400'
            }`} 
          />
          
          {/* Recruiter badge */}
          {isRecruiter && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                {/* Badge */}
                <StarIconSolid className="relative h-3 w-3 text-yellow-500 bg-white rounded-full p-0.5 recruiter-badge-glow" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showName && (
        <div className="flex flex-col">
          <span className={`text-sm ${
            isRecruiter 
              ? 'recruiter-name' 
              : 'text-gray-700'
          }`}>
            {user?.name || user?.email}
          </span>
          {isRecruiter && (
            <span className="text-xs text-yellow-600 font-medium flex items-center">
              <StarIcon className="h-3 w-3 mr-1" />
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Verified Recruiter
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;