-- Bonus 3: Supabase query examples
-- Run these in the Supabase SQL editor at supabase.com/dashboard

-- 1. See all messages
SELECT * FROM messages ORDER BY created_at DESC;

-- 2. Get only today's messages
SELECT * FROM messages
WHERE created_at::date = CURRENT_DATE
ORDER BY created_at;

-- 3. Get messages from a specific user
SELECT * FROM messages
WHERE user_id = 'your-user-id-here'
ORDER BY created_at;

-- 4. Count messages per user
SELECT user_id, COUNT(*) AS message_count
FROM messages
GROUP BY user_id
ORDER BY message_count DESC;

-- 5. Get the last 20 messages for a specific user (what the app loads on start)
SELECT role, content, created_at
FROM messages
WHERE user_id = 'your-user-id-here'
ORDER BY created_at DESC
LIMIT 20;

-- 6. Get messages from a specific date range
SELECT * FROM messages
WHERE created_at BETWEEN '2026-06-01' AND '2026-06-30'
ORDER BY created_at;
