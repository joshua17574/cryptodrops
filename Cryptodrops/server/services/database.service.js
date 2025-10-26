import bcrypt from 'bcrypt';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';
import { config } from '../config/env.config.js';
import { runMigrations } from '../utils/migration.js';

export class DatabaseService {
  async setupTables() {
    await runMigrations();
  }

  async initializeDefaultAdmin() {
    try {
      const adminUsername = config.adminUsername;
      const adminPassword = config.adminPassword;

      if (!adminUsername || !adminPassword) {
        console.warn('⚠️  ADMIN_USERNAME and ADMIN_PASSWORD environment variables are not set.');
        console.warn('⚠️  No default admin user will be created. Please set these variables to create an admin account.');
        return;
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, adminUsername))
        .limit(1);

      if (existingUser.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, config.bcryptRounds);
        await db.insert(users).values({
          username: adminUsername,
          password: hashedPassword,
          role: 'admin'
        });
        console.log(`✅ Admin user created: ${adminUsername}`);
        console.log('✅ Admin credentials set from environment variables');
      } else {
        console.log(`✅ Admin user ready: ${adminUsername}`);
      }
    } catch (error) {
      console.error('❌ Error creating default admin:', error);
    }
  }
}
