'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { inflationCalculatorSchema } from '@/lib/schemas';

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

type InflationFormValues = z.infer<typeof inflationCalculatorSchema>;

export default function InflationCalculator() {
  const [result, setResult] = useState<{ futureValue: number; totalInflation: number } | null>(null);

  const form = useForm<InflationFormValues>({
    resolver: zodResolver(inflationCalculatorSchema),
    defaultValues: {
      initialAmount: 1000,
      startYear: new Date().getFullYear() - 10,
      endYear: new Date().getFullYear(),
      inflationRate: 3,
    },
  });

  const onSubmit = (values: InflationFormValues) => {
    const { initialAmount, startYear, endYear, inflationRate } = values;
    const numberOfYears = endYear - startYear;
    const rate = inflationRate / 100;

    const futureValue = initialAmount * Math.pow(1 + rate, numberOfYears);
    const totalInflation = ((futureValue - initialAmount) / initialAmount) * 100;
    
    setResult({ futureValue, totalInflation });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Inflation Calculator</CardTitle>
        <CardDescription>
          Estimate the future value of money based on an inflation rate.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Initial Amount</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="inflationRate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Annual Inflation Rate (%)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="startYear"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 2010" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Year</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Value in End Year</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.futureValue)}
                  </p>
                  <p className="text-sm text-accent-foreground/80 mt-2">
                    This means ${form.getValues('initialAmount').toLocaleString()} in {form.getValues('startYear')} is equivalent to ${result.futureValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} in {form.getValues('endYear')}.
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Total Inflation</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                     {result.totalInflation.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Inflation
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
