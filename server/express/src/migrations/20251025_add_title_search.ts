import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  try {
    // Step 1: Add title_vector column (nullable at first) if it doesn't already exist
    await queryInterface.sequelize.query(`
      ALTER TABLE movies 
      ADD COLUMN IF NOT EXISTS title_vector tsvector;
    `);

    // Step 2: Create the trigger function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION movies_title_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.title_vector := to_tsvector('english', NEW.title);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Step 3: Update existing records to populate title_vector
    await queryInterface.sequelize.query(`
      UPDATE movies 
      SET title_vector = to_tsvector('english', title);
    `);

    // Step 4: Create the GIN index (concurrent to avoid locking)
    await queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS movies_title_vector_idx 
      ON movies 
      USING gin(title_vector);
    `);

    // Step 5: Create the trigger for future updates
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS movies_title_update ON movies;
      
      CREATE TRIGGER movies_title_update
        BEFORE INSERT OR UPDATE OF title
        ON movies
        FOR EACH ROW
        EXECUTE FUNCTION movies_title_trigger();
    `);

    // Step 6: Make title_vector NOT NULL now that it's populated, but only if no NULLs remain
    try {
      const [rows]: any = await queryInterface.sequelize.query(`SELECT COUNT(*)::int AS cnt FROM movies WHERE title_vector IS NULL;`);
      const nullCount = rows && rows[0] ? parseInt(rows[0].cnt, 10) : 0;
      if (nullCount === 0) {
        await queryInterface.sequelize.query(`
          ALTER TABLE movies 
          ALTER COLUMN title_vector 
          SET NOT NULL;
        `);
      } else {
        console.log(`Skipping SET NOT NULL because ${nullCount} rows still have NULL title_vector`);
      }
    } catch (err) {
      console.error('Error checking title_vector NULL count:', err);
      // don't throw — we want migration to be resilient
    }

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  try {
    // Remove in reverse order
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS movies_title_update ON movies;
      DROP FUNCTION IF EXISTS movies_title_trigger();
      DROP INDEX IF EXISTS movies_title_vector_idx;
      ALTER TABLE movies DROP COLUMN title_vector;
    `);
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  }
}