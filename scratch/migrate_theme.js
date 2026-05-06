const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Basic env parsing for .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=').trim()];
    })
);

const sql = neon(env.DATABASE_URL);

async function migrate() {
  try {
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light'`;
    console.log('Migration successful: added theme column');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
