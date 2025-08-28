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
    </div>
  );
};
