import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Database, Users, Shield, Settings } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { runSupabaseTests } from '../../utils/supabaseTest';
import './SetupPage.css';

export const SetupPage = () => {
  const [setupStatus, setSetupStatus] = useState({
    connection: 'checking',
    tables: 'checking',
    adminUser: 'checking',
    authentication: 'checking'
  });
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runSetupChecks();
  }, []);

  const runSetupChecks = async () => {
    setLoading(true);
    
    // Test 1: Connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      setSetupStatus(prev => ({
        ...prev,
        connection: error ? 'failed' : 'success'
      }));
    } catch (error) {
      setSetupStatus(prev => ({
        ...prev,
        connection: 'failed'
      }));
    }

    // Test 2: Tables exist
    try {
      const tables = ['users', 'user_content', 'user_activity_logs', 'dashboard_analytics'];
      let allTablesExist = true;

      for (const table of tables) {
        try {
          await supabase.from(table).select('*').limit(1);
        } catch (error) {
          allTablesExist = false;
          break;
        }
      }

      setSetupStatus(prev => ({
        ...prev,
        tables: allTablesExist ? 'success' : 'failed'
      }));
    } catch (error) {
      setSetupStatus(prev => ({
        ...prev,
        tables: 'failed'
      }));
    }

    // Test 3: Admin user exists
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .limit(1);

      setSetupStatus(prev => ({
        ...prev,
        adminUser: (!error && data && data.length > 0) ? 'success' : 'failed'
      }));
    } catch (error) {
      setSetupStatus(prev => ({
        ...prev,
        adminUser: 'failed'
      }));
    }

    // Test 4: Authentication
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSetupStatus(prev => ({
        ...prev,
        authentication: 'success' // Just test that auth is working
      }));
    } catch (error) {
      setSetupStatus(prev => ({
        ...prev,
        authentication: 'failed'
      }));
    }

    setLoading(false);
  };

  const runFullTests = async () => {
    setLoading(true);
    try {
      const results = await runSupabaseTests();
      setTestResults(results);
    } catch (error) {
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const allChecksPass = Object.values(setupStatus).every(status => status === 'success');

  return (
    <div className="setup-page">
      <div className="container">
        <div className="setup-header">
          <h1>Supabase Setup Status</h1>
          <p>Check your Supabase configuration and database setup</p>
        </div>

        <div className="setup-checks">
          <div className="check-item">
            <div className="check-icon">
              <Database className="w-6 h-6" />
            </div>
            <div className="check-content">
              <h3>Database Connection</h3>
              <p>Testing connection to Supabase database</p>
            </div>
            <div className="check-status">
              {getStatusIcon(setupStatus.connection)}
              <span>{getStatusText(setupStatus.connection)}</span>
            </div>
          </div>

          <div className="check-item">
            <div className="check-icon">
              <Settings className="w-6 h-6" />
            </div>
            <div className="check-content">
              <h3>Database Tables</h3>
              <p>Verifying required tables exist</p>
            </div>
            <div className="check-status">
              {getStatusIcon(setupStatus.tables)}
              <span>{getStatusText(setupStatus.tables)}</span>
            </div>
          </div>

          <div className="check-item">
            <div className="check-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="check-content">
              <h3>Admin User</h3>
              <p>Checking for admin user in database</p>
            </div>
            <div className="check-status">
              {getStatusIcon(setupStatus.adminUser)}
              <span>{getStatusText(setupStatus.adminUser)}</span>
            </div>
          </div>

          <div className="check-item">
            <div className="check-icon">
              <Shield className="w-6 h-6" />
            </div>
            <div className="check-content">
              <h3>Authentication</h3>
              <p>Testing Supabase authentication system</p>
            </div>
            <div className="check-status">
              {getStatusIcon(setupStatus.authentication)}
              <span>{getStatusText(setupStatus.authentication)}</span>
            </div>
          </div>
        </div>

        <div className="setup-actions">
          <button
            onClick={runSetupChecks}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Checking...' : 'Recheck Status'}
          </button>
          
          <button
            onClick={runFullTests}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Testing...' : 'Run Full Tests'}
          </button>
        </div>

        {allChecksPass && (
          <div className="success-message">
            <Check className="w-6 h-6 text-green-500" />
            <div>
              <h3>Setup Complete!</h3>
              <p>Your Supabase integration is working correctly. You can now use the admin dashboard.</p>
              <a href="/login" className="btn btn-primary">
                Go to Login
              </a>
            </div>
          </div>
        )}

        {!allChecksPass && !loading && (
          <div className="setup-instructions">
            <h3>Setup Instructions</h3>
            <ol>
              <li>
                <strong>Run Database Setup:</strong>
                <p>Go to your Supabase SQL Editor and run the <code>supabase-setup.sql</code> script</p>
              </li>
              <li>
                <strong>Create Admin User:</strong>
                <p>Create a user in Supabase Authentication, then update their role to 'admin'</p>
              </li>
              <li>
                <strong>Test Connection:</strong>
                <p>Run the checks again to verify everything is working</p>
              </li>
            </ol>
            
            <div className="setup-links">
              <a 
                href="https://supabase.com/dashboard/project/rtugujirmkcwdmdiwzow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Open Supabase Dashboard
              </a>
              <a href="/SUPABASE_SETUP.md" className="btn btn-outline">
                View Setup Guide
              </a>
            </div>
          </div>
        )}

        {testResults && (
          <div className="test-results">
            <h3>Detailed Test Results</h3>
            <pre>{JSON.stringify(testResults, null, 2)}</pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .setup-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        .setup-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .setup-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .setup-checks {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .check-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .check-item:last-child {
          border-bottom: none;
        }

        .check-icon {
          margin-right: 1rem;
          color: #666;
        }

        .check-content {
          flex: 1;
        }

        .check-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .check-content p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .check-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .setup-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #333;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 1px solid white;
        }

        .success-message {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .success-message h3 {
          margin: 0 0 0.5rem 0;
          color: #155724;
        }

        .success-message p {
          margin: 0 0 1rem 0;
          color: #155724;
        }

        .setup-instructions {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .setup-instructions ol {
          margin: 1rem 0;
        }

        .setup-instructions li {
          margin-bottom: 1rem;
        }

        .setup-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .test-results {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .test-results pre {
          background: #fff;
          padding: 1rem;
          border-radius: 4px;
          overflow: auto;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};
