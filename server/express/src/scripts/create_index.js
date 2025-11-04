const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movieReviewDB', 'postgres', '12345678', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: console.log
});

async function createIndex() {
  try {
    console.log('Testing connection...');
    await sequelize.authenticate();
    console.log('Connection successful!');

    console.log('Creating index...');
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS movies_title_vector_idx 
      ON movies 
      USING gin(title_vector);
    `);
    console.log('Index creation command sent');

    const [indexes] = await sequelize.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'movies' 
        AND indexname = 'movies_title_vector_idx';
    `);
    
    console.log('Index check result:', indexes);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

createIndex();