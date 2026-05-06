import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  try {
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light'`;
    console.log('Migration successful: added theme column');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
