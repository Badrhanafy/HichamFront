import React, { useState } from 'react';
import axios from 'axios';
import Prism from './Prism';
import logo from '../assets/images/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', formData);
      
      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect or show success message
        console.log('Registration successful:', response.data.data);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Prism Background */}
      <div className="absolute inset-0 overflow-hidden">
        <Prism />
      </div>

      <div className="relative w-full max-w-4xl"> {/* Increased max-width for landscape */}
        {/* Register Card - Landscape Layout */}
        <div className="bg-black/40 backdrop-blur-lg border border-gray-800 shadow-2xl p-8">
          {/* Header */}
          <center>
            <img src={logo} className='w-24 h-26 mb-4' alt="Logo" />
          </center>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">CREATE ACCOUNT</h1>
            <p className="text-gray-400 text-sm">Join our network and unlock new possibilities</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Register Form - Grid Layout for Landscape */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                FULL NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-colors duration-200 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-colors duration-200 placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-colors duration-200 placeholder-gray-500"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-colors duration-200 placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>

            {/* Register Button - Full Width */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative">
                  {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
                </span>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-white text-xs">
              By registering, you agree to our terms and conditions.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
      </div>
    </div>
  );
};

export default Register;