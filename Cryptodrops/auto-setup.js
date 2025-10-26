import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function autoSetup() {
  console.log('🔧 Auto-setup starting...\n');

  // Check if .env exists, if not create template
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) {
    console.log('⚠️  .env file not found!');
    console.log('📝 Please create a .env file with the following variables:');
    console.log('   DATABASE_URL=<your_database_url>');
    console.log('   JWT_SECRET=<your_jwt_secret>');
    console.log('   ADMIN_USERNAME=<your_admin_username>');
    console.log('   ADMIN_PASSWORD=<your_admin_password>\n');
    console.log('💡 See .env.example for reference\n');
  } else {
    console.log('✅ .env file exists\n');
  }

  console.log('✅ Auto-setup complete!\n');
}

autoSetup().catch(console.error);
