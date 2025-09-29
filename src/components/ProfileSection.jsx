import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const ProfileSection = () => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate initials for avatar
  const getUserInitials = () => {
    if (userData.name) {
      return userData.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Profile Information</h1>
      <p className="text-gray-400 mb-8">Manage your account settings and preferences</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{getUserInitials()}</span>
              </div>
              
              {/* User Info */}
              <h2 className="text-xl font-bold text-white mb-2">{userData.name || 'No Name'}</h2>
              <p className="text-gray-400 mb-1">{userData.email || 'No Email'}</p>
              <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm capitalize">
                {userData.role || 'user'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">Account Details</h3>
            
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <p className="text-white text-lg">{userData.name || 'Not set'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <p className="text-white text-lg">{userData.email || 'Not set'}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <p className="text-white text-lg capitalize">{userData.role || 'user'}</p>
                </div>
              </div>

              {/* Account Created */}
              <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                  <p className="text-white text-lg">{formatDate(userData.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200">
                Edit Profile
              </button>
              <button className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-colors duration-200">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;