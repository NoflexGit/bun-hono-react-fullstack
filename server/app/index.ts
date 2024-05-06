import { Hono } from 'hono';
import { logger } from 'hono/logger';
import expensesRoutes from './routes/expenses.ts';

const app = new Hono();

app.use('*', logger());

app.route('/api/expenses', expensesRoutes);

app.get('/', (c) => c.text('Hono!'));

export default app;
