import express from 'express';
import cors from 'cors';
import { getDashboard } from './dashboardService';
import { pool } from './db';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'UP',
      service: 'datalens-bff',
      postgres: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    });
  } catch {
    res.status(503).json({ status: 'DOWN' });
  }
});

app.get('/api/dashboard', async (req, res, next) => {
  try {
    const from = String(req.query.from || '2026-01-01');
    const to = String(req.query.to || '2026-01-31');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      return res.status(400).json({
        message: 'from and to must be YYYY-MM-DD'
      });
    }

    res.json(await getDashboard(from, to));
  } catch (error) {
    next(error);
  }
});

app.get('/api/transactions', async (req, res, next) => {
  try {
    const from = String(req.query.from || '2026-01-01');
    const to = String(req.query.to || '2026-01-31');

    const result = await pool.query(`
      SELECT id,transaction_date::text AS date,channel,category,
             amount::numeric,status
      FROM transactions
      WHERE transaction_date BETWEEN $1 AND $2
      ORDER BY transaction_date DESC,id DESC
    `, [from, to]);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});
