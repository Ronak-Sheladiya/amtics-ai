// Simple test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rtugujirmkcwdmdiwzow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dWd1amlybWtjd2RtZGl3em93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMzcsImV4cCI6MjA3MTcyMjEzN30.rubkhODavaIFhSj6FM4uhFleOG0RdAVlmogcJhYDKsc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔌 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');

// Test basic connection
try {
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Error details:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('✅ Supabase is properly configured and ready to use');
  }
} catch (error) {
  console.log('❌ Connection test failed:', error.message);
}
