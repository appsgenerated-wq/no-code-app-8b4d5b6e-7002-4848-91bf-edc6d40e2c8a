import React, { useState } from 'react';
import config from '../constants.js';
import { RocketLaunchIcon, UserGroupIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        await onSignup(formData.email, formData.password, formData.name, formData.role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center space-x-2">
            <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MercuryDash</span>
          </div>
          <a 
            href={`${config.BACKEND_URL}/admin`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Admin Panel
          </a>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center pt-20 pb-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center px-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Delivery, <span className="text-blue-600">Faster Than Light.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              MercuryDash is your on-demand platform for local deliveries, connecting customers, drivers, and restaurants seamlessly.
            </p>
            <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-3">
                    <UserGroupIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-800">For Everyone</h3>
                        <p className="text-gray-500">Whether you're a customer, driver, or restaurant owner, we have the tools for you.</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <ShoppingCartIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-800">Endless Options</h3>
                        <p className="text-gray-500">Discover local favorites and get them delivered to your door.</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-center font-semibold rounded-md transition-all duration-300 ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-center font-semibold rounded-md transition-all duration-300 ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                   <select value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500">
                      <option value="customer">Customer</option>
                      <option value="driver">Driver</option>
                      <option value="restaurant_owner">Restaurant Owner</option>
                  </select>
                </div>
              )}
              {error && <p className="text-sm text-red-600 text-center p-2 bg-red-50 rounded-md">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
