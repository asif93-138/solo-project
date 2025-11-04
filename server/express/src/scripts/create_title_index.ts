import sequelize from '../models/sequelize';

async function createTitleVectorIndex() {
  console.log('Connecting to database...');
  
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    console.log('Creating GIN index on title_vector...');
    
    const result = await sequelize.query(`
      CREATE INDEX IF NOT EXISTS movies_title_vector_idx 
      ON movies 
      USING gin(title_vector);
    `);
    
    console.log('Index creation query executed');
    
    // Verify the index
    const [indexes] = await sequelize.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'movies' 
        AND indexname = 'movies_title_vector_idx';
    `);
    
    if (indexes.length > 0) {
      console.log('✅ Index created and verified:', indexes[0]);
    } else {
      console.log('❌ Index not found after creation attempt');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

console.log('Starting index creation script...');
createTitleVectorIndex().catch(console.error);