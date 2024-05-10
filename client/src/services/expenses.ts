import api from '@/lib/api.ts';

export const getExpensesSum = async () => {
  const res = await api.expenses['total-spent'].$get();
  if (!res.ok) throw new Error('Failed to fetch expenses sum');

  return await res.json();
};
