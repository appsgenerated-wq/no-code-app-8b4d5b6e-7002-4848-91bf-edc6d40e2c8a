import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(false);
  
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    // Health check
    fetch('/api/health')
      .then(res => setBackendHealthy(res.ok))
      .catch(() => setBackendHealthy(false));

    // Check if user is already logged in
    manifest.from('User').me()
      .then(currentUser => {
        if (currentUser) {
          setUser(currentUser);
          setCurrentScreen('dashboard');
        }
      })
      .catch(() => {
        setUser(null);
        setCurrentScreen('landing');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.auth('User').login(email, password);
    } catch (error) {
      // Fallback for older SDK versions
      await manifest.from('User').login(email, password);
    }
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
    setCurrentScreen('dashboard');
  };

  const signup = async (email, password, name, role) => {
    await manifest.from('User').signup({ email, password, name, role });
    // Auto-login after signup for a smooth UX
    try {
      await manifest.auth('User').login(email, password);
    } catch (error) {
      await manifest.from('User').login(email, password);
    }
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
    setCurrentScreen('dashboard');
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to MercuryDash...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white p-2 rounded-full shadow-md">
        <div className={`w-3 h-3 rounded-full ${backendHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-600">Backend Status</span>
      </div>
      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage 
          user={user} 
          onLogout={logout} 
          manifest={manifest}
        />
      )}
    </div>
  );
}

export default App;
