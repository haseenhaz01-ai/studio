'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { paypalFeeSchema } from '@/lib/schemas';

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

type PaypalFeeFormValues = z.infer<typeof paypalFeeSchema>;

interface PaypalFeeResult {
  fee: number;
  amountReceived: number;
}

// Standard US domestic fee: 2.9% + $0.30
const FEE_PERCENTAGE = 0.029;
const FIXED_FEE = 0.30;

export default function PaypalFeeCalculator() {
  const [result, setResult] = useState<PaypalFeeResult | null>(null);

  const form = useForm<PaypalFeeFormValues>({
    resolver: zodResolver(paypalFeeSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const onSubmit = (values: PaypalFeeFormValues) => {
    const { amount } = values;
    const fee = amount * FEE_PERCENTAGE + FIXED_FEE;
    const amountReceived = amount - fee;
    setResult({ fee, amountReceived });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">PayPal Fee Calculator</CardTitle>
        <CardDescription>
          Estimate the fee for a standard domestic transaction. This is an estimate and may not reflect the actual fee charged by PayPal.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">PayPal Fee</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.fee)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Amount You Receive</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.amountReceived)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Fee
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
