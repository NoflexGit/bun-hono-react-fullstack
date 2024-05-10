import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/create-expense')({
  component: () => <div>Hello /create-expense!</div>
})