import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import './ForgotPasswordPage.css';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('22amtics221@gmail.com');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  if (success) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <div className="success-content">
              <CheckCircle className="success-icon" />
              <h1 className="success-title">Check Your Email</h1>
              <p className="success-message">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="success-instructions">
                Please check your email and click the link to reset your password. 
                The link will expire in 24 hours.
              </p>
              <div className="success-actions">
                <Link to="/login" className="back-to-login-btn">
                  <ArrowLeft className="button-icon" />
                  Back to Login
                </Link>
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="send-again-btn"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <div className="logo-section">
              <img
                src="/logo.png"
                alt="AMTICS Media"
                className="forgot-password-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h1 className="forgot-password-title">Reset Password</h1>
            </div>
            <p className="forgot-password-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {error && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email address"
                autoComplete="email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="reset-button"
            >
              {loading ? (
                <div className="button-loading">
                  <div className="spinner-small"></div>
                  Sending Reset Link...
                </div>
              ) : (
                <>
                  <Mail className="button-icon" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="login-link">
                Back to Login
              </Link>
            </p>
            <Link to="/" className="back-home">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
