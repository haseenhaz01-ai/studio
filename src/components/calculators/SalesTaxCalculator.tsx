'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { salesTaxSchema } from '@/lib/schemas';

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

type SalesTaxFormValues = z.infer<typeof salesTaxSchema>;

interface SalesTaxResult {
  taxAmount: number;
  totalAmount: number;
}

export default function SalesTaxCalculator() {
  const [result, setResult] = useState<SalesTaxResult | null>(null);

  const form = useForm<SalesTaxFormValues>({
    resolver: zodResolver(salesTaxSchema),
    defaultValues: {
      amount: 100,
      taxRate: 8.5,
    },
  });

  const onSubmit = (values: SalesTaxFormValues) => {
    const { amount, taxRate } = values;
    const taxAmount = amount * (taxRate / 100);
    const totalAmount = amount + taxAmount;
    setResult({ taxAmount, totalAmount });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Sales Tax Calculator</CardTitle>
        <CardDescription>
          Calculate sales tax and the total amount.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pre-Tax Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Tax Amount</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.taxAmount)}
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Total Amount (Post-Tax)</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                     {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalAmount)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Tax
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
