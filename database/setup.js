import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Database setup script for Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rtugujirmkcwdmdiwzow.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key needed for admin operations

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required for database setup');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');

    // Read and execute schema.sql
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8');
    console.log('📊 Creating database tables and functions...');
    
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    if (schemaError) {
      console.error('❌ Error executing schema:', schemaError);
      return;
    }
    console.log('✅ Database schema created successfully');

    // Read and execute storage.sql
    const storageSQL = fs.readFileSync(path.join(process.cwd(), 'database/storage.sql'), 'utf8');
    console.log('🗄️ Setting up storage buckets and policies...');
    
    const { error: storageError } = await supabase.rpc('exec_sql', { sql: storageSQL });
    if (storageError) {
      console.error('❌ Error executing storage setup:', storageError);
      return;
    }
    console.log('✅ Storage buckets and policies created successfully');

    // Verify setup by checking if tables exist
    console.log('🔍 Verifying database setup...');
    const { data: tables, error: verifyError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'user_content', 'user_activity_logs', 'dashboard_analytics']);

    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError);
      return;
    }

    console.log('✅ Database setup completed successfully!');
    console.log('📋 Created tables:', tables.map(t => t.table_name).join(', '));

    // Insert sample data if needed
    await insertSampleData();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
};

const insertSampleData = async () => {
  try {
    console.log('📝 Inserting sample data...');

    // Check if admin user already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', '22amtics221@gmail.com')
      .single();

    if (!existingAdmin) {
      // Insert default admin user
      const { error: userError } = await supabase
        .from('users')
        .insert({
          name: 'Ronak Sheladiya',
          enrollment_number: '202203103510221',
          email: '22amtics221@gmail.com',
          position: 'Vice-Chair',
          role: 'admin',
          user_role: 'Graphic Designer',
          status: 'active',
          is_first_login: false,
          is_onboarded: true,
          bio: 'Vice-Chair and lead graphic designer at AMTICS. Passionate about creating innovative designs and managing the creative team.'
        });

      if (userError) {
        console.error('❌ Error inserting admin user:', userError);
      } else {
        console.log('✅ Default admin user created');
      }
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Insert sample activity log
    const { error: logError } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: existingAdmin?.id,
        action_type: 'system_setup',
        action_description: 'Database schema initialized',
        metadata: { setup_version: '1.0' }
      });

    if (logError) {
      console.error('❌ Error inserting activity log:', logError);
    } else {
      console.log('✅ Sample activity log created');
    }

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
};

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;
