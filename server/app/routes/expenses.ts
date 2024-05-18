import { Hono } from 'hono';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getUserMiddleware } from '../kinde.ts';
import { db } from '../db';
import { expenses as expensesTable } from '../db/schemas/expenses';
import { and, desc, eq, sum } from 'drizzle-orm';

const expenseSchema = z.object({
  id: z.number().int().positive(),
  amount: z.string(),
  title: z.string().min(3).max(255),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const expensesRoutes = new Hono()
  .get('/', getUserMiddleware, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses });
  })
  .post(
    '/',
    getUserMiddleware,
    zValidator('json', createExpenseSchema),
    async (c) => {
      const user = c.var.user;

      const expense = await c.req.valid('json');

      const result = await db
        .insert(expensesTable)
        .values({
          ...expense,
          userId: user.id,
        })
        .returning();

      return c.json(result);
    },
  )
  .get('/:id{[0-9]+}', getUserMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .get('/total-spent', getUserMiddleware, async (c) => {
    const user = c.var.user;

    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return c.json(result);
  })
  .delete('/:id{[0-9]+}', getUserMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.var.user;

    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  });

export default expensesRoutes;
