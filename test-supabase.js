import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = 'https://knrdkjekbxbeuivryemf.supabase.co';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection');
console.log('URL:', url);
console.log('Key starts with:', key ? key.substring(0, 15) + '...' : 'undefined');

const supabase = createClient(url, key);

async function testConnection() {
  try {
    // Try to fetch something generic or sign up
    const { data, error } = await supabase.auth.signUp({
      email: 'test' + Date.now() + '@example.com',
      password: 'TestPassword123!',
      options: {
        data: { name: 'Test User', role: 'tourist' }
      }
    });
    
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Success! User created:', data.user?.email);
    }
  } catch (err) {
    console.error('Fetch/Network Exception:', err);
  }
}

testConnection();
