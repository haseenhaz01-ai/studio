'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { ctrSchema } from '@/lib/schemas';

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

type CtrFormValues = z.infer<typeof ctrSchema>;

export default function CtrCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<CtrFormValues>({
    resolver: zodResolver(ctrSchema),
    defaultValues: {
      totalClicks: 150,
      totalImpressions: 10000,
    },
  });

  const onSubmit = (values: CtrFormValues) => {
    const { totalClicks, totalImpressions } = values;
    if (totalImpressions > 0) {
      const ctr = (totalClicks / totalImpressions) * 100;
      setResult(ctr);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Click-Through Rate (CTR) Calculator</CardTitle>
        <CardDescription>
          Calculate the click-through rate of your campaigns.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="totalClicks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Clicks</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 150" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalImpressions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Impressions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result !== null && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Click-Through Rate (CTR)</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate CTR
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
