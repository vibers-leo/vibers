import { Pool } from 'pg';

let pool: Pool | null = null;

export const getDbPool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:vibers123@101.202.34.11:5432/vibers_admin';
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000, // 5초 타임아웃
      query_timeout: 5000,
    });
  }
  return pool;
};

export const query = (text: string, params?: any[]) => {
  const dbPool = getDbPool();
  return dbPool.query(text, params);
};
