'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { statisticsCalculatorSchema } from '@/lib/schemas';

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
import { Textarea } from '@/components/ui/textarea';

type StatisticsFormValues = z.infer<typeof statisticsCalculatorSchema>;

interface StatisticsResult {
  mean: number;
  median: number;
  mode: number[] | 'N/A';
  stdDev: number;
  count: number;
  sum: number;
}

export default function StatisticsCalculator() {
  const [result, setResult] = useState<StatisticsResult | null>(null);

  const form = useForm<StatisticsFormValues>({
    resolver: zodResolver(statisticsCalculatorSchema),
    defaultValues: {
      data: '1 2 3 4 5 5 6 7 8 9',
    },
  });

  const calculateStatistics = (numbers: number[]): StatisticsResult => {
    const count = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sortedNumbers[mid] : (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2;

    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    for (const num of numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
      }
    }

    let mode: number[] | 'N/A';
    if (maxFreq > 1) {
      mode = Object.keys(frequency).filter(key => frequency[Number(key)] === maxFreq).map(Number);
    } else {
      mode = 'N/A';
    }

    const stdDev = Math.sqrt(numbers.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / count);

    return { mean, median, mode, stdDev, count, sum };
  };


  const onSubmit = (values: StatisticsFormValues) => {
    const numbers = values.data.split(/[\s,]+/).filter(Boolean).map(Number);
    if (numbers.length > 0) {
      const stats = calculateStatistics(numbers);
      setResult(stats);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Statistics Calculator</CardTitle>
        <CardDescription>
          Calculate mean, median, mode, and standard deviation for a set of numbers.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Set</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter numbers separated by spaces or commas, e.g., 1 2 3 4 5"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                  <p className="text-sm text-primary-foreground/80">Mean (Average)</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground">
                    {result.mean.toFixed(4)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                  <p className="text-sm text-primary-foreground/80">Median</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground">
                    {result.median.toFixed(4)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                  <p className="text-sm text-primary-foreground/80">Mode</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground truncate">
                    {Array.isArray(result.mode) ? result.mode.join(', ') : result.mode}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                  <p className="text-sm text-accent-foreground/80">Standard Deviation</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {result.stdDev.toFixed(4)}
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                  <p className="text-sm text-accent-foreground/80">Count</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {result.count}
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                  <p className="text-sm text-accent-foreground/80">Sum</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {result.sum}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Statistics
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
