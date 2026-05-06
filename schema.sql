CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial profile
INSERT INTO profile (name, bio, avatar_url)
VALUES ('My Name', 'This is my bio', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  icon_name VARCHAR(100),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
