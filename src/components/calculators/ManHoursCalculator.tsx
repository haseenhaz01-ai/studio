'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { manHoursSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type ManHoursFormValues = z.infer<typeof manHoursSchema>;

export default function ManHoursCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<ManHoursFormValues>({
    resolver: zodResolver(manHoursSchema),
    defaultValues: {
      numberOfWorkers: 10,
      hoursPerWorker: 8,
      numberOfDays: 5,
    },
  });

  const onSubmit = (values: ManHoursFormValues) => {
    const { numberOfWorkers, hoursPerWorker, numberOfDays } = values;
    const totalManHours = numberOfWorkers * hoursPerWorker * numberOfDays;
    setResult(totalManHours);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Man-Hours Calculator</CardTitle>
        <CardDescription>
          Calculate the total man-hours required for a project.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="numberOfWorkers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Workers</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hoursPerWorker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours per Worker (per day)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Days</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result !== null && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Total Man-Hours</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.toLocaleString()} hours
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Man-Hours
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
