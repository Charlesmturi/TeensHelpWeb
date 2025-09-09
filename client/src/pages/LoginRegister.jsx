import React, { useState } from 'react';
import axios from 'axios';
import '../styles/auth.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'teen',
    username: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on user type
      redirectUser(user.userType);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userType) => {
    const redirectPaths = {
      admin: '/admin',
      teen: '/dashboard',
      parent: '/parent-dashboard',
      counselor: '/counselor-dashboard',
      therapist: '/therapist-dashboard',
      schoolAdmin: '/school-admin',
      other: '/dashboard'
    };
    
    window.location.href = redirectPaths[userType] || '/';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleDemoLogin = async (userType) => {
    setLoading(true);
    setError('');

    const demoCredentials = {
      admin: { email: 'admin@demo.com', password: 'demo123' },
      teen: { email: 'teen@demo.com', password: 'demo123' },
      counselor: { email: 'counselor@demo.com', password: 'demo123' },
      therapist: { email: 'therapist@demo.com', password: 'demo123' },
      parent: { email: 'parent@demo.com', password: 'demo123' },
      schoolAdmin: { email: 'school@demo.com', password: 'demo123' }
    };

    try {
      const credentials = demoCredentials[userType];
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      redirectUser(user.userType);
      
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <p>{isLogin ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-tabs">
          <button 
            className={isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="userType">I am a... *</label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="teen">Teen</option>
                  <option value="admin">Admin</option>
                  <option value="parent">Parent</option>
                  <option value="counselor">Counselor</option>
                  <option value="therapist">Therapist</option>
                  <option value="schoolAdmin">School Administrator</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <div className="demo-login-section">
            <h3>Quick Demo Login</h3>
            <div className="demo-buttons">
              <button onClick={() => handleDemoLogin('teen')} disabled={loading}>
                Teen Demo
              </button>
              <button onClick={() => handleDemoLogin('counselor')} disabled={loading}>
                Counselor Demo
              </button>
              <button onClick={() => handleDemoLogin('parent')} disabled={loading}>
                Parent Demo
              </button>
              <button onClick={() => handleDemoLogin('admin')} disabled={loading}>
                Admin Demo
              </button>
            </div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="auth-switch" 
              onClick={() => !loading && setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>

        <div className="auth-features">
          <h3>Why create an account?</h3>
          <ul>
            <li>🔒 Save your progress and track your journey</li>
            <li>💬 Access live chat with professionals</li>
            <li>📊 Personalized resources and recommendations</li>
            <li>🎯 Get tailored support based on your needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;