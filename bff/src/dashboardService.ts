import { pool } from './db';
import { DashboardDto } from './types';

export async function getDashboard(
  from: string,
  to: string
): Promise<DashboardDto> {
  const [kpi, trend, channels, mix, transactions] = await Promise.all([
    pool.query(`
      SELECT
        COALESCE(SUM(amount),0)::numeric revenue,
        COUNT(*)::int orders,
        COUNT(DISTINCT customer_id)::int customers,
        COALESCE(AVG(amount),0)::numeric average_order_value
      FROM transactions
      WHERE transaction_date BETWEEN $1 AND $2
        AND status='COMPLETED'
    `, [from, to]),

    pool.query(`
      SELECT transaction_date::text AS date,
             COALESCE(SUM(amount),0)::numeric revenue
      FROM transactions
      WHERE transaction_date BETWEEN $1 AND $2
        AND status='COMPLETED'
      GROUP BY transaction_date
      ORDER BY transaction_date
    `, [from, to]),

    pool.query(`
      SELECT channel, COUNT(*)::int orders
      FROM transactions
      WHERE transaction_date BETWEEN $1 AND $2
      GROUP BY channel
      ORDER BY orders DESC
    `, [from, to]),

    pool.query(`
      SELECT c.segment, COUNT(DISTINCT t.customer_id)::int customers
      FROM transactions t
      JOIN customers c ON c.id=t.customer_id
      WHERE t.transaction_date BETWEEN $1 AND $2
      GROUP BY c.segment
      ORDER BY customers DESC
    `, [from, to]),

    pool.query(`
      SELECT id, transaction_date::text AS date, channel, category,
             amount::numeric, status
      FROM transactions
      WHERE transaction_date BETWEEN $1 AND $2
      ORDER BY transaction_date DESC, id DESC
      LIMIT 500
    `, [from, to])
  ]);

  const row = kpi.rows[0];

  return {
    kpis: {
      revenue: Number(row.revenue),
      orders: Number(row.orders),
      customers: Number(row.customers),
      averageOrderValue: Number(row.average_order_value)
    },
    revenueTrend: trend.rows.map(x => ({
      date: x.date,
      revenue: Number(x.revenue)
    })),
    ordersByChannel: channels.rows.map(x => ({
      channel: x.channel,
      orders: Number(x.orders)
    })),
    customerMix: mix.rows.map(x => ({
      segment: x.segment,
      customers: Number(x.customers)
    })),
    transactions: transactions.rows.map(x => ({
      id: Number(x.id),
      date: x.date,
      channel: x.channel,
      category: x.category,
      amount: Number(x.amount),
      status: x.status
    }))
  };
}
