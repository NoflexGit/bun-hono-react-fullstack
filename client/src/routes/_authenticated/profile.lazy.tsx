import { createLazyFileRoute } from '@tanstack/react-router';
import { userQueryOptions } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

const Profile = () => {
  const { data, error, isPending } = useQuery(userQueryOptions);

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <p>{data.user.email}</p>
        </div>
      )}
    </div>
  );
};

export const Route = createLazyFileRoute('/_authenticated/profile')({
  component: Profile,
});
