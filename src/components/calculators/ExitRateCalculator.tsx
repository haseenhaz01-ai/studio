'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { exitRateSchema } from '@/lib/schemas';

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

type ExitRateFormValues = z.infer<typeof exitRateSchema>;

export default function ExitRateCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<ExitRateFormValues>({
    resolver: zodResolver(exitRateSchema),
    defaultValues: {
      totalExits: 100,
      totalPageviews: 1000,
    },
  });

  const onSubmit = (values: ExitRateFormValues) => {
    const { totalExits, totalPageviews } = values;
    if (totalPageviews > 0) {
      const exitRate = (totalExits / totalPageviews) * 100;
      setResult(exitRate);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Exit Rate Calculator</CardTitle>
        <CardDescription>
          Calculate the percentage of visitors who exit from a specific page.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="totalExits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Exits from Page</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPageviews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Pageviews of Page</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result !== null && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Exit Rate</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Exit Rate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
