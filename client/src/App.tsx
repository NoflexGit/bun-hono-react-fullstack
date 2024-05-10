import { useQuery } from '@tanstack/react-query';
import { getExpensesSum } from '@/services/expenses.ts';

const App = () => {
  const { data } = useQuery({
    queryKey: ['expenses', 'sum'],
    queryFn: getExpensesSum,
  });

  return (
    <div className="bg-blue-500 h-full w-full">
      <h1>{data?.total}</h1>
    </div>
  );
};

export default App;
