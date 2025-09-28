'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { evmSchema } from '@/lib/schemas';

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

type EvmFormValues = z.infer<typeof evmSchema>;

interface EvmResult {
  costVariance: number;
  scheduleVariance: number;
  cpi: number;
  spi: number;
}

export default function EvmCalculator() {
  const [result, setResult] = useState<EvmResult | null>(null);

  const form = useForm<EvmFormValues>({
    resolver: zodResolver(evmSchema),
    defaultValues: {
      plannedValue: 50000,
      earnedValue: 45000,
      actualCost: 55000,
    },
  });

  const onSubmit = (values: EvmFormValues) => {
    const { plannedValue, earnedValue, actualCost } = values;

    const costVariance = earnedValue - actualCost;
    const scheduleVariance = earnedValue - plannedValue;
    const cpi = earnedValue / actualCost;
    const spi = earnedValue / plannedValue;

    setResult({
      costVariance,
      scheduleVariance,
      cpi,
      spi,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Earned Value Management (EVM) Calculator</CardTitle>
        <CardDescription>
          Assess your project's performance in terms of cost and schedule.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="plannedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Value (PV)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="earnedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Earned Value (EV)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 45000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actualCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Cost (AC)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 55000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                  <p className="text-sm text-accent-foreground/80">Cost Variance (CV)</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.costVariance)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                  <p className="text-sm text-primary-foreground/80">Schedule Variance (SV)</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.scheduleVariance)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                  <p className="text-sm text-accent-foreground/80">Cost Performance Index (CPI)</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {result.cpi.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                  <p className="text-sm text-primary-foreground/80">Schedule Performance Index (SPI)</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground">
                    {result.spi.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate EVM
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
