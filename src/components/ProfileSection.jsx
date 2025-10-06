import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Calendar, Edit3, Key, Zap, Sparkles, Crown, X, Save, Lock, Camera, Trash2, Upload } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/images/logo.png'
const ProfileSection = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
     const API_URL = import.meta.env.VITE_BACKEND_URL;
  // Form states - FIXED: Initialize with proper values
  const [nameForm, setNameForm] = useState({ name: userData.name || '' });
  const [emailForm, setEmailForm] = useState({ 
    email: userData.email || '', 
    current_password: '' 
  });
  const [passwordForm, setPasswordForm] = useState({ 
    current_password: '', 
    new_password: '', 
    new_password_confirmation: '' 
  });
  const [avatarLoading, setAvatarLoading] = useState(false);

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

  // Get role badge color
  const getRoleColor = (role) => {
    const colors = {
      'admin': 'from-red-500 to-pink-600',
      'user': 'from-cyan-500 to-blue-600',
      'editor': 'from-purple-500 to-indigo-600',
      'default': 'from-gray-500 to-slate-600'
    };
    return colors[role] || colors.default;
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Update user data in state and localStorage
  const updateUserData = (newData) => {
    const updatedUser = { ...userData, ...newData };
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // FIXED: Reset forms when modal opens
  const openModal = (modalType) => {
    setActiveModal(modalType);
    // Reset forms to current user data
    if (modalType === 'name') {
      setNameForm({ name: userData.name || '' });
    } else if (modalType === 'email') {
      setEmailForm({ 
        email: userData.email || '', 
        current_password: '' 
      });
    } else if (modalType === 'password') {
      setPasswordForm({ 
        current_password: '', 
        new_password: '', 
        new_password_confirmation: '' 
      });
    }
  };

  // Update name
  const handleUpdateName = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/profile/update-name`, 
        nameForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        updateUserData(response.data.data.user);
        setActiveModal(null);
        showMessage('success', 'Name updated successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const handleUpdateEmail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/profile/update-email`, 
        emailForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        updateUserData(response.data.data.user);
        setActiveModal(null);
        setEmailForm({ ...emailForm, current_password: '' });
        showMessage('success', 'Email updated successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/profile/update-password`, 
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setActiveModal(null);
        setPasswordForm({ 
          current_password: '', 
          new_password: '', 
          new_password_confirmation: '' 
        });
        showMessage('success', 'Password updated successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${API_URL}http://localhost:8000/api/profile/update-avatar`, 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (response.data.success) {
        updateUserData(response.data.data.user);
        showMessage('success', 'Avatar updated successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle avatar removal
  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/api/profile/remove-avatar`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        updateUserData(response.data.data.user);
        showMessage('success', 'Avatar removed successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to remove avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Modal components with FIXED input handling
  const NameModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-black border border-cyan-400/20 max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">UPDATE NAME</h3>
          <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              FULL NAME
            </label>
            <input
              type="text"
              value={nameForm.name}
              onChange={(e) => setNameForm({ name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Enter your full name"
              autoFocus // Auto focus on input
            />
          </div>
          
          <button
            onClick={handleUpdateName}
            disabled={loading || !nameForm.name.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'UPDATING...' : 'UPDATE NAME'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const EmailModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-black border border-cyan-400/20 max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">UPDATE EMAIL</h3>
          <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              NEW EMAIL
            </label>
            <input
              type="email"
              value={emailForm.email}
              onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Enter new email address"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              CURRENT PASSWORD
            </label>
            <input
              type="password"
              value={emailForm.current_password}
              onChange={(e) => setEmailForm({ ...emailForm, current_password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Enter your current password"
            />
          </div>
          
          <button
            onClick={handleUpdateEmail}
            disabled={loading || !emailForm.email.trim() || !emailForm.current_password}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'UPDATING...' : 'UPDATE EMAIL'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const PasswordModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-black border border-cyan-400/20 max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">CHANGE PASSWORD</h3>
          <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              CURRENT PASSWORD
            </label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Enter current password"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              NEW PASSWORD
            </label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
              CONFIRM NEW PASSWORD
            </label>
            <input
              type="password"
              value={passwordForm.new_password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
              placeholder="Confirm new password"
            />
          </div>
          
          <button
            onClick={handleUpdatePassword}
            disabled={loading || !passwordForm.current_password || !passwordForm.new_password || passwordForm.new_password !== passwordForm.new_password_confirmation}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Message Alert */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-400/20 text-green-400' 
            : 'bg-red-500/10 border-red-400/20 text-red-400'
        } backdrop-blur-lg`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10">
           <img src={logo} className='w-12 h-12' alt="" />
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Admin Profile</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ACCOUNT OVERVIEW
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage your profile settings and account preferences
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile Card - Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-8 group hover:border-cyan-400/30 transition-all duration-500">
              {/* Avatar with Upload Functionality */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4 group/avatar">
                  <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-500 relative overflow-hidden">
                    {userData.avatar ? (
                      <img 
                        src={`${API_URL}/storage/${userData.avatar}`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white">{getUserInitials()}</span>
                    )}
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                        <span className="text-white text-xs font-medium">Change Avatar</span>
                      </div>
                    </div>
                    
                    {/* Loading Spinner */}
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <button
                    onClick={triggerFileInput}
                    disabled={avatarLoading}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 flex items-center justify-center transition-all duration-300 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Remove Avatar Button */}
                  {userData.avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={avatarLoading}
                      className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 flex items-center justify-center transition-all duration-300 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                
                {/* User Info */}
                <h2 className="text-2xl font-black text-white mb-2">{userData.name || 'No Name'}</h2>
                <p className="text-gray-400 mb-3 text-sm">{userData.email || 'No Email'}</p>
                <span className={`px-4 py-2 bg-gradient-to-r ${getRoleColor(userData.role)} text-white text-xs font-bold uppercase tracking-wider`}>
                  {userData.role || 'user'}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-cyan-400 font-medium">{formatDate(userData.created_at)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-cyan-400 font-medium">Just now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="xl:col-span-3">
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">ACCOUNT DETAILS</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Card */}
                <div className="bg-white/5 border border-white/10 p-6 group hover:border-cyan-400/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors duration-300">
                      <User className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Full Name</label>
                      <p className="text-white text-lg font-semibold">{userData.name || 'Not set'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openModal('name')}
                    className="w-full py-3 bg-white/5 border border-white/10 text-cyan-400 text-sm font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    UPDATE NAME
                  </button>
                </div>

                {/* Email Card */}
                <div className="bg-white/5 border border-white/10 p-6 group hover:border-cyan-400/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Email Address</label>
                      <p className="text-white text-lg font-semibold">{userData.email || 'Not set'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openModal('email')}
                    className="w-full py-3 bg-white/5 border border-white/10 text-blue-400 text-sm font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    CHANGE EMAIL
                  </button>
                </div>

                {/* Role Card */}
                <div className="bg-white/5 border border-white/10 p-6 group hover:border-cyan-400/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Account Role</label>
                      <p className="text-white text-lg font-semibold capitalize">{userData.role || 'user'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Role determines your access level and permissions within the system
                  </div>
                </div>

                {/* Join Date Card */}
                <div className="bg-white/5 border border-white/10 p-6 group hover:border-cyan-400/30 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Member Since</label>
                      <p className="text-white text-lg font-semibold">{formatDate(userData.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Welcome to our platform! We're glad to have you with us.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <button 
                  onClick={() => openModal('name')}
                  className="py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Edit3 className="w-5 h-5" />
                  EDIT PROFILE
                </button>
                <button 
                  onClick={() => openModal('password')}
                  className="py-4 border border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Key className="w-5 h-5" />
                  CHANGE PASSWORD
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-400/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-cyan-400 text-sm font-medium">Account Security</p>
                    <p className="text-gray-400 text-xs">Your account information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'name' && <NameModal />}
      {activeModal === 'email' && <EmailModal />}
      {activeModal === 'password' && <PasswordModal />}
    </div>
  );
};

export default ProfileSection;