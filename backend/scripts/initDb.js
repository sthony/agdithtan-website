import { initDatabase } from '../config/database.js';

async function main() {
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('✓ Database initialized successfully!');
    console.log('✓ All tables created');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
