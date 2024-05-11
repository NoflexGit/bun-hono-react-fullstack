import React from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

const CreateExpense = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const response = await api.expenses.$post({ json: value });

      if (!response.ok) {
        throw new Error('Failed to create expense');
      }

      navigate({ to: '/' });
    },
  });

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return (
    <div className="container">
      <form className="w-1/3 mx-auto" onSubmit={handleSubmitForm}>
        <form.Field
          name="title"
          children={(field) => (
            <div className="mb-4 space-y-2">
              <Label htmlFor="field.name">Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder="Enter the title"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors && (
                <p>{field.state.meta.touchedErrors}</p>
              )}
            </div>
          )}
        />
        <form.Field
          name="amount"
          children={(field) => (
            <div className="mb-4 space-y-2">
              <Label htmlFor="field.name">Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder="Enter the amount"
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.touchedErrors && (
                <p>{field.state.meta.touchedErrors}</p>
              )}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  );
};

export const Route = createLazyFileRoute('/create-expense')({
  component: CreateExpense,
});
