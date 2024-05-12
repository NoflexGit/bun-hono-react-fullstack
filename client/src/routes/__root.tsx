import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import Menu from '@/components/Menu';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient } from '@tanstack/react-query';

interface MyRouteContext {
  queryClient: QueryClient;
}

const App = () => {
  return (
    <>
      <div className="flex h-screen">
        <nav className="border-r p-4 w-[250px]">
          <div className="mb-8">
            <Link to="/" className="uppercase font-semibold">
              Expense Tracker
            </Link>
          </div>
          <Menu />
        </nav>
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: App,
});
