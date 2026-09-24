import { Pool } from 'pg';

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://datalens:datalens@localhost:5432/datalens',
  max: 10
});
