-- migrate:up
ALTER TABLE users 
ADD isAdmin tinyint DEFAULT 0;
-- 0: false, 1: true

-- migrate:down

