import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProfile() {
  const userId = '674f2e8d-46a1-4b1f-958a-29a0b4fe1807';
  const email = 'comfit99@naver.com';
  
  console.log('Creating profile for user:', email);
  
  // Only insert columns that exist in migration 001
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      nickname: 'comfit99',
      avatar_url: null,
      role: 'customer',
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error creating profile:', error.message);
    console.error('Details:', error);
  } else {
    console.log('✅ Profile created successfully!');
    console.log('Profile ID:', data.id);
    console.log('Email:', data.email);
    console.log('Nickname:', data.nickname);
    console.log('Role:', data.role);
  }
}

createProfile().catch(console.error);
