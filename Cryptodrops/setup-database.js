import { client as pool } from './server/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Setting up database...\n');
    
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created\n');
    
    console.log('Creating airdrops table...');
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
      );
    `);
    console.log('✅ Airdrops table created\n');
    
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    
    if (!username || !password) {
      console.log('⚠️  ADMIN_USERNAME and ADMIN_PASSWORD not set in .env file');
      console.log('⚠️  Skipping admin user creation');
      console.log('\nTo create an admin user, add to your .env file:');
      console.log('   ADMIN_USERNAME=your_username');
      console.log('   ADMIN_PASSWORD=your_password');
    } else {
      console.log('Creating admin user...');
      const userCheck = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      
      if (userCheck.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
          'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
          [username, hashedPassword, 'admin']
        );
        console.log(`✅ Admin user created: ${username}\n`);
      } else {
        console.log(`ℹ️  Admin user already exists: ${username}\n`);
      }
    }
    
    console.log('✨ Database setup complete!\n');
    console.log('Start your server with: npm start');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nPlease check:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database exists');
    console.log('3. Connection credentials in .env are correct');
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
