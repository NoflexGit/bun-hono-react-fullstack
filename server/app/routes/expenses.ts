import { Hono } from 'hono';
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getUserMiddleware } from '../kinde.ts';

const expenseSchema = z.object({
  id: z.number().int().positive(),
  amount: z.number().int().positive(),
  title: z.string().min(3).max(255),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const expenses: Expense[] = [
  {
    id: 1,
    amount: 100,
    title: 'Lunch',
  },
  {
    id: 2,
    amount: 200,
    title: 'Dinner',
  },
  {
    id: 3,
    amount: 300,
    title: 'Breakfast',
  },
  {
    id: 4,
    amount: 400,
    title: 'Supper',
  },
  {
    id: 5,
    amount: 500,
    title: 'Snack',
  },
];

const expensesRoutes = new Hono()
  .get('/', getUserMiddleware, (c) => c.json({ expenses }))
  .post(
    '/',
    getUserMiddleware,
    zValidator('json', createExpenseSchema),
    async (c) => {
      const expense = await c.req.valid('json');
      expenses.push({ id: expenses.length + 1, ...expense });

      return c.json({ expense: c.body });
    },
  )
  .get('/:id{[0-9]+}', getUserMiddleware, (c) => {
    const id = parseInt(c.req.param('id'));
    const expense = expenses.find((expense) => expense.id === id);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .get('/total-spent', getUserMiddleware, (c) => {
    const result = expenses.reduce((acc, item) => {
      return (acc += item.amount);
    }, 0);
    return c.json({ total: result });
  })
  .delete('/:id{[0-9]+}', getUserMiddleware, (c) => {
    const id = parseInt(c.req.param('id'));
    const expense = expenses.find((expense) => expense.id === id);

    if (!expense) {
      return c.notFound();
    }

    expenses.splice(expenses.indexOf(expense), 1);

    return c.json({ expense });
  });

export default expensesRoutes;
