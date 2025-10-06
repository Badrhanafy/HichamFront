import React, { useState } from 'react';
import axios from 'axios';
import DarkVeil from './DarkVeil';
import Prism from './Prism';
import logo from '../assets/images/logo.png'
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
      const API_URL = import.meta.env.VITE_BACKEND_URL;
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
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);

            if (response.data.success) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Redirect or show success message
                console.log('Login successful:', response.data.data);
                window.location.href = '/Admin'; // Adjust redirect as needed
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <Prism />
            </div>

            <div className="relative w-full max-w-md">
                {/* Login Card */}
                <div className="bg-black/40 backdrop-blur-lg border border-gray-800 shadow-2xl p-8">
                    {/* Header */}
                    <center>
                        <img src={logo} className='w-24 h-26' alt="" />
                    </center>
                    <div className="text-center mb-8">

                        <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="relative">
                                {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <div className="mt-6 text-center">
                            <p className="text-white text-xs">
                                Secure access only. Unauthorized attempts will be logged.
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Don't have an account?{' '}
                                <a
                                    href="/register"
                                    className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                                >
                                    Create one here
                                </a>
                            </p>
                        </div>
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

export default Login;