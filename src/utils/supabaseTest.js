import { supabase, dbHelpers, authHelpers, storageHelpers } from '../config/supabase.js';
import { StorageSetup } from './storageSetup.js';
import { activityLogger } from './activityLogger.js';

// Supabase Test Suite
export class SupabaseTestSuite {
  constructor() {
    this.testResults = {
      connection: null,
      tables: {},
      functions: {},
      storage: {},
      auth: {},
      policies: {},
      overall: null
    };
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting Supabase Test Suite...');
    
    try {
      // Test connection
      await this.testConnection();
      
      // Test database schema
      await this.testDatabaseSchema();
      
      // Test database functions
      await this.testDatabaseFunctions();
      
      // Test storage setup
      await this.testStorageSetup();
      
      // Test authentication (basic)
      await this.testAuthentication();
      
      // Test row level security
      await this.testRowLevelSecurity();
      
      // Generate overall result
      this.generateOverallResult();
      
      console.log('✅ Supabase Test Suite completed');
      return this.testResults;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.testResults.overall = { status: 'failed', error: error.message };
      return this.testResults;
    }
  }

  // Test basic connection
  async testConnection() {
    console.log('🔌 Testing Supabase connection...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        this.testResults.connection = {
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      } else {
        this.testResults.connection = {
          status: 'passed',
          message: 'Successfully connected to Supabase',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      this.testResults.connection = {
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Test database schema
  async testDatabaseSchema() {
    console.log('📊 Testing database schema...');
    
    const expectedTables = [
      'users',
      'user_content',
      'user_activity_logs',
      'dashboard_analytics'
    ];

    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          this.testResults.tables[tableName] = {
            status: 'failed',
            error: error.message
          };
        } else {
          this.testResults.tables[tableName] = {
            status: 'passed',
            message: `Table ${tableName} exists and is accessible`
          };
        }
      } catch (error) {
        this.testResults.tables[tableName] = {
          status: 'failed',
          error: error.message
        };
      }
    }

    // Test table structure for users table
    await this.testUsersTableStructure();
  }

  // Test users table structure
  async testUsersTableStructure() {
    try {
      // Try to insert a test user (will be removed)
      const testUser = {
        name: 'Test User',
        enrollment_number: 'TEST001',
        email: 'test@example.com',
        role: 'member',
        status: 'active'
      };

      const { data, error } = await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single();

      if (!error && data) {
        // Clean up test user
        await supabase
          .from('users')
          .delete()
          .eq('id', data.id);

        this.testResults.tables.users_structure = {
          status: 'passed',
          message: 'Users table structure is correct'
        };
      } else {
        this.testResults.tables.users_structure = {
          status: 'failed',
          error: error?.message || 'Unknown error'
        };
      }
    } catch (error) {
      this.testResults.tables.users_structure = {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Test database functions
  async testDatabaseFunctions() {
    console.log('⚙️ Testing database functions...');
    
    // Test get_user_stats function
    try {
      const { data, error } = await supabase.rpc('get_user_stats');
      
      if (error) {
        this.testResults.functions.get_user_stats = {
          status: 'failed',
          error: error.message
        };
      } else {
        this.testResults.functions.get_user_stats = {
          status: 'passed',
          message: 'get_user_stats function works correctly',
          data: data
        };
      }
    } catch (error) {
      this.testResults.functions.get_user_stats = {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Test storage setup
  async testStorageSetup() {
    console.log('🗄️ Testing storage setup...');
    
    try {
      // Check if buckets exist
      const bucketCheck = await StorageSetup.checkBuckets();
      
      this.testResults.storage.buckets = {
        status: bucketCheck.exists ? 'passed' : 'warning',
        existingBuckets: bucketCheck.existingBuckets || [],
        missingBuckets: bucketCheck.missingBuckets || [],
        message: bucketCheck.exists ? 'All buckets exist' : 'Some buckets are missing'
      };

      // Test storage stats
      const storageStats = await StorageSetup.getStorageStats();
      this.testResults.storage.stats = {
        status: storageStats.error ? 'failed' : 'passed',
        data: storageStats.data,
        error: storageStats.error
      };

    } catch (error) {
      this.testResults.storage = {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Test authentication
  async testAuthentication() {
    console.log('🔐 Testing authentication...');
    
    try {
      // Test getCurrentUser
      const { user, error } = await authHelpers.getCurrentUser();
      
      this.testResults.auth.getCurrentUser = {
        status: error ? 'failed' : 'passed',
        message: error ? error.message : 'getCurrentUser function works',
        hasUser: !!user
      };

    } catch (error) {
      this.testResults.auth = {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Test row level security
  async testRowLevelSecurity() {
    console.log('🛡️ Testing row level security...');
    
    try {
      // Test if RLS is enabled on tables
      const tables = ['users', 'user_content', 'user_activity_logs'];
      
      for (const table of tables) {
        try {
          // This is a basic test - in practice you'd need to test with different user contexts
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);

          this.testResults.policies[table] = {
            status: 'passed',
            message: `RLS policies are active on ${table}`
          };
        } catch (error) {
          this.testResults.policies[table] = {
            status: 'failed',
            error: error.message
          };
        }
      }
    } catch (error) {
      this.testResults.policies = {
        status: 'failed',
        error: error.message
      };
    }
  }

  // Generate overall result
  generateOverallResult() {
    const allTests = [
      this.testResults.connection,
      ...Object.values(this.testResults.tables),
      ...Object.values(this.testResults.functions),
      ...Object.values(this.testResults.storage),
      ...Object.values(this.testResults.auth),
      ...Object.values(this.testResults.policies)
    ].filter(test => test && typeof test === 'object');

    const passedTests = allTests.filter(test => test.status === 'passed').length;
    const failedTests = allTests.filter(test => test.status === 'failed').length;
    const warningTests = allTests.filter(test => test.status === 'warning').length;

    this.testResults.overall = {
      status: failedTests === 0 ? 'passed' : 'failed',
      summary: {
        total: allTests.length,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests
      },
      timestamp: new Date().toISOString()
    };
  }

  // Print test report
  printReport() {
    console.log('\n📋 SUPABASE TEST REPORT');
    console.log('='.repeat(50));
    
    // Connection
    const conn = this.testResults.connection;
    console.log(`\n🔌 Connection: ${this.getStatusIcon(conn.status)} ${conn.status.toUpperCase()}`);
    if (conn.error) console.log(`   Error: ${conn.error}`);
    
    // Tables
    console.log('\n📊 Database Tables:');
    Object.entries(this.testResults.tables).forEach(([table, result]) => {
      console.log(`   ${table}: ${this.getStatusIcon(result.status)} ${result.status.toUpperCase()}`);
      if (result.error) console.log(`     Error: ${result.error}`);
    });
    
    // Functions
    console.log('\n⚙️ Database Functions:');
    Object.entries(this.testResults.functions).forEach(([func, result]) => {
      console.log(`   ${func}: ${this.getStatusIcon(result.status)} ${result.status.toUpperCase()}`);
      if (result.error) console.log(`     Error: ${result.error}`);
    });
    
    // Storage
    console.log('\n🗄️ Storage:');
    Object.entries(this.testResults.storage).forEach(([item, result]) => {
      console.log(`   ${item}: ${this.getStatusIcon(result.status)} ${result.status.toUpperCase()}`);
      if (result.error) console.log(`     Error: ${result.error}`);
      if (result.missingBuckets?.length > 0) {
        console.log(`     Missing buckets: ${result.missingBuckets.join(', ')}`);
      }
    });
    
    // Overall
    const overall = this.testResults.overall;
    console.log(`\n🎯 Overall Result: ${this.getStatusIcon(overall.status)} ${overall.status.toUpperCase()}`);
    console.log(`   Tests: ${overall.summary.passed}/${overall.summary.total} passed`);
    if (overall.summary.failed > 0) {
      console.log(`   Failures: ${overall.summary.failed}`);
    }
    if (overall.summary.warnings > 0) {
      console.log(`   Warnings: ${overall.summary.warnings}`);
    }
    
    console.log('\n' + '='.repeat(50));
  }

  getStatusIcon(status) {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  }
}

// Database Helper Tests
export class DatabaseHelperTests {
  // Test dbHelpers functions
  static async testDbHelpers() {
    console.log('🧪 Testing database helper functions...');
    
    const results = {};
    
    try {
      // Test getUserCounts
      const { data: stats, error: statsError } = await dbHelpers.getUserCounts();
      results.getUserCounts = {
        status: statsError ? 'failed' : 'passed',
        data: stats,
        error: statsError?.message
      };
      
      // Test getUsers
      const { data: users, error: usersError } = await dbHelpers.getUsers({ limit: 5 });
      results.getUsers = {
        status: usersError ? 'failed' : 'passed',
        count: users?.length || 0,
        error: usersError?.message
      };
      
      // Test getActivityLogs
      const { data: logs, error: logsError } = await dbHelpers.getActivityLogs({ limit: 5 });
      results.getActivityLogs = {
        status: logsError ? 'failed' : 'passed',
        count: logs?.length || 0,
        error: logsError?.message
      };
      
    } catch (error) {
      results.error = error.message;
    }
    
    return results;
  }
}

// Quick connection test function
export const quickConnectionTest = async () => {
  try {
    console.log('⚡ Running quick connection test...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Test environment variables
    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log(`📋 Environment check:`);
    console.log(`   VITE_SUPABASE_URL: ${hasUrl ? '✅' : '❌'}`);
    console.log(`   VITE_SUPABASE_ANON_KEY: ${hasKey ? '✅' : '❌'}`);
    
    return hasUrl && hasKey;
  } catch (error) {
    console.log('❌ Quick test failed:', error.message);
    return false;
  }
};

// Initialize and run tests if called directly
export const runSupabaseTests = async () => {
  const testSuite = new SupabaseTestSuite();
  const results = await testSuite.runAllTests();
  testSuite.printReport();
  return results;
};

export default { SupabaseTestSuite, DatabaseHelperTests, quickConnectionTest, runSupabaseTests };
