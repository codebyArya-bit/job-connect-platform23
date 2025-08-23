import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import RecruiterFeatureDemo from '../components/RecruiterFeatureDemo';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Job Search',
      description: 'Find jobs that match your skills and preferences with our advanced search filters.'
    },
    {
      icon: BriefcaseIcon,
      title: 'Easy Applications',
      description: 'Apply to multiple jobs with just one click using your saved profile and resume.'
    },
    {
      icon: UserGroupIcon,
      title: 'Connect with Recruiters',
      description: 'Get discovered by top recruiters and companies looking for talent like you.'
    },
    {
      icon: ChartBarIcon,
      title: 'Track Progress',
      description: 'Monitor your job applications and get insights on your job search progress.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Connect with top employers and discover opportunities that match your skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/jobs"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/jobs"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/dashboard"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About JobConnect
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              JobConnect is more than just a job board – we're a comprehensive career platform designed to bridge the gap between talented professionals and forward-thinking employers. Our mission is to revolutionize the hiring process by creating meaningful connections that drive career growth and business success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <LightBulbIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation-Driven</h3>
              <p className="text-gray-600">Leveraging cutting-edge technology to match the right talent with the right opportunities</p>
            </div>
            <div className="text-center p-6">
              <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">Verified profiles, authentic job postings, and transparent hiring processes for all users</p>
            </div>
            <div className="text-center p-6">
              <GlobeAltIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600">Connecting talent and opportunities across industries, locations, and career levels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="py-24 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Employment Crisis We're Solving
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              The modern job market faces unprecedented challenges that affect millions of professionals and businesses worldwide. JobConnect addresses these critical issues head-on.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">73%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Mismatch</h3>
              <p className="text-gray-600">Of employers struggle to find candidates with the right skills, while qualified professionals remain unemployed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">6 Months</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Average Job Search</h3>
              <p className="text-gray-600">The typical job search takes 6+ months, causing financial stress and career stagnation</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">85%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hidden Job Market</h3>
              <p className="text-gray-600">Of jobs are never publicly advertised, limiting access to opportunities for most job seekers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">$15K</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost Per Hire</h3>
              <p className="text-gray-600">Companies spend an average of $15,000 per hire due to inefficient recruitment processes</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">42%</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Turnover</h3>
              <p className="text-gray-600">High turnover rates due to poor job-candidate matching and unrealistic expectations</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-4xl font-bold mb-2">3 Weeks</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Time</h3>
              <p className="text-gray-600">Average time for candidates to hear back from employers, creating frustration and uncertainty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-24 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How JobConnect Solves These Problems
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Our comprehensive platform addresses each challenge with innovative solutions that benefit both job seekers and employers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600">Our advanced algorithms analyze skills, experience, and preferences to create perfect job-candidate matches, reducing the skills gap by 60%.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <ClockIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Notifications</h3>
                  <p className="text-gray-600">Real-time alerts and automated responses ensure candidates hear back within 24 hours, not weeks.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Recruiter Access</h3>
                  <p className="text-gray-600">Connect directly with verified recruiters and hiring managers, accessing the hidden job market that others can't reach.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost-Effective Hiring</h3>
                  <p className="text-gray-600">Reduce hiring costs by up to 70% through streamlined processes and better candidate pre-screening.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BriefcaseIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Development</h3>
                  <p className="text-gray-600">Comprehensive career guidance, skill assessments, and professional development resources to ensure long-term success.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-3 rounded-full">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">Verified profiles, background checks, and performance tracking ensure quality matches and reduce turnover by 50%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JobConnect?
            </h2>
            <p className="text-xl text-gray-600">
              We make job searching simple, efficient, and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Job Search?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of job seekers who found their dream jobs through JobConnect
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}
      
      {/* Recruiter Feature Demo */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🌟 Enhanced Recruiter Profiles
            </h2>
            <p className="text-lg text-gray-600">
              Easily identify verified recruiters with our special visual indicators
            </p>
          </div>
          <RecruiterFeatureDemo />
        </div>
      </div>
    </div>
  );
};

export default Home;