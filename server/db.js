import pg from 'pg';

const { Pool } = pg;

const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log('[DB] Slow query:', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('[DB] Query error:', { text, error: error.message });
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}

export default pool;
