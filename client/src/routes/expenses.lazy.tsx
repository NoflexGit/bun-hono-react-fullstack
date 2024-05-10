import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/expenses')({
  component: () => <div>Hello /expenses!</div>
})