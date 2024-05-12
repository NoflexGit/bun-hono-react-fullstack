import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import expensesRoutes from './routes/expenses.ts';
import authRoute from './routes/auth.ts';

const app = new Hono();

app.use('*', logger());

const apiRoutes = app
  .basePath('/api')
  .route('/expenses', expensesRoutes)
  .route('/auth', authRoute);

app.use('*', serveStatic({ root: './client/dist' }));
app.get('*', serveStatic({ path: './client/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
