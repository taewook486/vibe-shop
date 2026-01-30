import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrCreateProfile() {
  const userId = '674f2e8d-46a1-4b1f-958a-29a0b4fe1807';
  const email = 'comfit99@naver.com';
  
  // Check profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error || !profile) {
    console.log('Profile not found, creating...');
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        nickname: 'comfit99',
        role: 'customer',
        grade: 'bronze',
        points: 0,
        total_order_amount: 0,
        is_blocked: false,
      });
    
    if (insertError) {
      console.error('❌ Error creating profile:', insertError.message);
    } else {
      console.log('✅ Profile created successfully!');
    }
  } else {
    console.log('✅ Profile exists');
    console.log('Nickname:', profile.nickname);
    console.log('Role:', profile.role);
    console.log('Grade:', profile.grade);
  }
}

checkOrCreateProfile().catch(console.error);
