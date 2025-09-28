'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { liquidNetWorthSchema } from '@/lib/schemas';

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

type LiquidNetWorthFormValues = z.infer<typeof liquidNetWorthSchema>;

export default function LiquidNetWorthCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<LiquidNetWorthFormValues>({
    resolver: zodResolver(liquidNetWorthSchema),
    defaultValues: {
      cashAndInvestments: 50000,
      shortTermLiabilities: 10000,
    },
  });

  const onSubmit = (values: LiquidNetWorthFormValues) => {
    const { cashAndInvestments, shortTermLiabilities } = values;
    const liquidNetWorth = cashAndInvestments - shortTermLiabilities;
    setResult(liquidNetWorth);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Liquid Net Worth Calculator</CardTitle>
        <CardDescription>
          Calculate your net worth that is easily convertible to cash.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="cashAndInvestments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Liquid Assets (Cash, Investments)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortTermLiabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Short-Term Liabilities (Credit Card Debt, etc.)</FormLabel>
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
                  <p className="text-sm text-accent-foreground/80">Liquid Net Worth</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Liquid Net Worth
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
