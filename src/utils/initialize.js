import { quickConnectionTest, runSupabaseTests } from './supabaseTest.js';
import { StorageSetup } from './storageSetup.js';
import { activityLogger } from './activityLogger.js';

// Admin Dashboard Initialization Script
export class AdminDashboardInitializer {
  constructor() {
    this.initResults = {
      connection: null,
      database: null,
      storage: null,
      tests: null,
      timestamp: new Date().toISOString()
    };
  }

  // Run complete initialization
  async initialize() {
    console.log('🚀 Initializing Admin Dashboard...');
    console.log('='.repeat(50));

    try {
      // Step 1: Test connection
      await this.testConnection();
      
      // Step 2: Initialize storage
      await this.initializeStorage();
      
      // Step 3: Run comprehensive tests
      await this.runTests();
      
      // Step 4: Log initialization
      await this.logInitialization();
      
      console.log('\n✅ Admin Dashboard initialization completed!');
      return this.initResults;
    } catch (error) {
      console.error('\n❌ Initialization failed:', error);
      this.initResults.error = error.message;
      return this.initResults;
    }
  }

  // Test basic connection
  async testConnection() {
    console.log('\n🔌 Testing Supabase connection...');
    
    try {
      const isConnected = await quickConnectionTest();
      this.initResults.connection = {
        status: isConnected ? 'success' : 'failed',
        timestamp: new Date().toISOString()
      };
      
      if (!isConnected) {
        throw new Error('Failed to connect to Supabase');
      }
    } catch (error) {
      this.initResults.connection = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  // Initialize storage buckets
  async initializeStorage() {
    console.log('\n🗄️ Initializing storage buckets...');
    
    try {
      const storageResults = await StorageSetup.initializeStorage();
      
      this.initResults.storage = {
        status: storageResults.errors.length === 0 ? 'success' : 'partial',
        buckets: storageResults.buckets,
        errors: storageResults.errors,
        timestamp: new Date().toISOString()
      };
      
      if (storageResults.errors.length > 0) {
        console.log('⚠️ Storage initialization had some issues:');
        storageResults.errors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log('✅ Storage buckets initialized successfully');
      }
    } catch (error) {
      this.initResults.storage = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  // Run comprehensive tests
  async runTests() {
    console.log('\n🧪 Running comprehensive tests...');
    
    try {
      const testResults = await runSupabaseTests();
      
      this.initResults.tests = {
        status: testResults.overall.status,
        summary: testResults.overall.summary,
        details: testResults,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.initResults.tests = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  // Log initialization activity
  async logInitialization() {
    try {
      // This would log to the admin user if available
      // For now, we'll just log the system event
      await activityLogger.logSystemEvent(
        'initialization',
        'Admin dashboard initialized',
        {
          connection_status: this.initResults.connection?.status,
          storage_status: this.initResults.storage?.status,
          tests_status: this.initResults.tests?.status,
          init_timestamp: this.initResults.timestamp
        }
      );
    } catch (error) {
      console.warn('Warning: Could not log initialization activity:', error.message);
    }
  }

  // Print initialization summary
  printSummary() {
    console.log('\n📋 INITIALIZATION SUMMARY');
    console.log('='.repeat(50));
    
    const { connection, storage, tests } = this.initResults;
    
    console.log(`🔌 Connection: ${this.getStatusIcon(connection.status)} ${connection.status}`);
    console.log(`🗄️ Storage: ${this.getStatusIcon(storage.status)} ${storage.status}`);
    console.log(`🧪 Tests: ${this.getStatusIcon(tests.status)} ${tests.status}`);
    
    if (tests.summary) {
      console.log(`   Tests passed: ${tests.summary.passed}/${tests.summary.total}`);
    }
    
    if (storage.errors && storage.errors.length > 0) {
      console.log(`   Storage issues: ${storage.errors.length}`);
    }
    
    console.log(`\n⏰ Completed at: ${this.initResults.timestamp}`);
    console.log('='.repeat(50));
  }

  getStatusIcon(status) {
    switch (status) {
      case 'success': return '✅';
      case 'partial': return '⚠️';
      case 'failed': return '❌';
      case 'passed': return '✅';
      default: return '❓';
    }
  }
}

// Environment checker
export const checkEnvironment = () => {
  console.log('🔍 Checking environment configuration...');
  
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = [];
  const present = [];
  
  required.forEach(envVar => {
    if (import.meta.env[envVar]) {
      present.push(envVar);
    } else {
      missing.push(envVar);
    }
  });
  
  console.log('\n📋 Environment Variables:');
  present.forEach(env => console.log(`   ✅ ${env}`));
  missing.forEach(env => console.log(`   ❌ ${env} (missing)`));
  
  if (missing.length > 0) {
    console.log('\n⚠️ Missing environment variables. Please set:');
    missing.forEach(env => {
      console.log(`   export ${env}="your_value_here"`);
    });
    return false;
  }
  
  console.log('\n✅ All required environment variables are set');
  return true;
};

// Quick setup function
export const quickSetup = async () => {
  console.log('⚡ Running quick setup...');
  
  // Check environment
  if (!checkEnvironment()) {
    console.log('❌ Environment check failed. Please set required variables.');
    return false;
  }
  
  // Test connection
  const connected = await quickConnectionTest();
  if (!connected) {
    console.log('❌ Connection test failed.');
    return false;
  }
  
  console.log('✅ Quick setup completed successfully!');
  return true;
};

// Full initialization function
export const initializeAdminDashboard = async () => {
  const initializer = new AdminDashboardInitializer();
  const results = await initializer.initialize();
  initializer.printSummary();
  return results;
};

// Database health check
export const healthCheck = async () => {
  console.log('🏥 Running health check...');
  
  try {
    const results = await quickConnectionTest();
    
    if (results) {
      console.log('✅ System is healthy');
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } else {
      console.log('❌ System has issues');
      return { status: 'unhealthy', timestamp: new Date().toISOString() };
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return { 
      status: 'unhealthy', 
      error: error.message, 
      timestamp: new Date().toISOString() 
    };
  }
};

// Export everything
export default {
  AdminDashboardInitializer,
  checkEnvironment,
  quickSetup,
  initializeAdminDashboard,
  healthCheck
};
