import { createFileRoute, Outlet } from '@tanstack/react-router';
import { userQueryOptions } from '@/services/auth.ts';

const Login = () => {
  return <div>You have To login</div>;
};

const Component = () => {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <Login />;
  } else {
    return <Outlet />;
  }
};

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const user = await queryClient.fetchQuery(userQueryOptions);
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
  component: Component,
});
