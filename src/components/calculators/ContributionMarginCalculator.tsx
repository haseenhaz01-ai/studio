'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { contributionMarginSchema } from '@/lib/schemas';

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

type ContributionMarginFormValues = z.infer<typeof contributionMarginSchema>;

export default function ContributionMarginCalculator() {
  const [result, setResult] = useState<{ contributionMargin: number; contributionMarginRatio: number } | null>(null);

  const form = useForm<ContributionMarginFormValues>({
    resolver: zodResolver(contributionMarginSchema),
    defaultValues: {
      totalSales: 10000,
      totalVariableCosts: 4000,
    },
  });

  const onSubmit = (values: ContributionMarginFormValues) => {
    const { totalSales, totalVariableCosts } = values;
    if (totalSales < totalVariableCosts) {
      setResult(null);
      form.setError("totalSales", { type: "manual", message: "Total Sales must be greater than Total Variable Costs." });
      return;
    }
    const contributionMargin = totalSales - totalVariableCosts;
    const contributionMarginRatio = (contributionMargin / totalSales) * 100;
    setResult({ contributionMargin, contributionMarginRatio });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Contribution Margin Calculator</CardTitle>
        <CardDescription>
          Calculate the contribution margin and its ratio to sales.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="totalSales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Sales</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalVariableCosts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Variable Costs</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Contribution Margin</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.contributionMargin)}
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Contribution Margin Ratio</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                    {result.contributionMarginRatio.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
