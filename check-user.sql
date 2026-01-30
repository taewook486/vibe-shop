-- Check if user exists
SELECT id, email, created_at, updated_at 
FROM auth.users 
WHERE email = 'comfit99@naver.com';
