import sequelize from '../models/sequelize';
import { up } from '../migrations/20251025_add_title_search';

async function run() {
  console.log('Running title_vector migration via migration.up()...');
  const queryInterface: any = { sequelize };
  try {
    await up(queryInterface);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      await sequelize.close();
    } catch (e) {
      // ignore
    }
  }
}

run();
