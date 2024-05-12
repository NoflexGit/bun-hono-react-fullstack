import api from '@/lib/api.ts';
import { queryOptions } from '@tanstack/react-query';

export const getUser = async () => {
  const res = await api.auth.me.$get();
  if (!res.ok) throw new Error('Failed to get user');

  return await res.json();
};

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getUser,
  staleTime: Infinity,
});
