import { sql } from 'drizzle-orm';
import { db, client } from '../db.js';

export async function runMigrations() {
  try {
    console.log('🔧 Running database migrations...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS airdrops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        blockchain VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        verified BOOLEAN DEFAULT false,
        logo TEXT,
        airdrop_link VARCHAR(500),
        website VARCHAR(500),
        twitter VARCHAR(500),
        discord VARCHAR(500),
        telegram VARCHAR(500),
        total_value VARCHAR(100),
        estimated_reward VARCHAR(100),
        participants INTEGER DEFAULT 0,
        difficulty VARCHAR(50),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        requirements JSON,
        category VARCHAR(100),
        featured BOOLEAN DEFAULT false,
        ended BOOLEAN DEFAULT false,
        potential BOOLEAN DEFAULT false,
        confirmed BOOLEAN DEFAULT false,
        is_latest BOOLEAN DEFAULT false,
        is_free BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT true
      )
    `);

    const columnsToAdd = [
      { name: 'ended', type: 'BOOLEAN DEFAULT false' },
      { name: 'potential', type: 'BOOLEAN DEFAULT false' },
      { name: 'confirmed', type: 'BOOLEAN DEFAULT false' },
      { name: 'featured', type: 'BOOLEAN DEFAULT false' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'requirements', type: 'JSON' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'is_latest', type: 'BOOLEAN DEFAULT false' },
      { name: 'is_free', type: 'BOOLEAN DEFAULT false' }
    ];

    for (const column of columnsToAdd) {
      try {
        await client.query(`
          ALTER TABLE airdrops 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
      } catch (err) {
      }
    }

    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}
