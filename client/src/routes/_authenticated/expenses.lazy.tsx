import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/expenses')({
  component: () => <div>Hello /expenses!</div>
})