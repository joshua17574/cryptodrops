import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { db } from './server/db.js';
import { users } from './server/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('❌ Error: ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file');
      console.log('\nPlease add these to your .env file:');
      console.log('ADMIN_USERNAME=your_username');
      console.log('ADMIN_PASSWORD=your_secure_password');
      process.exit(1);
    }
    
    const existingUser = await db.select().from(users).where(eq(users.username, adminUsername)).limit(1);
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, adminUsername));
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully!');
    }
    
    console.log(`\n✅ Admin user is ready: ${adminUsername}`);
    console.log('\nYou can now login to the admin panel!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    console.log('\nMake sure you have:');
    console.log('1. Set up your DATABASE_URL, ADMIN_USERNAME, and ADMIN_PASSWORD in .env file');
    console.log('2. Run: npm run db:push');
    process.exit(1);
  }
}

setupAdmin();
