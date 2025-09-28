'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { adsenseSchema } from '@/lib/schemas';

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

type AdsenseFormValues = z.infer<typeof adsenseSchema>;

export default function AdsenseCalculator() {
  const [result, setResult] = useState<{ earnings: number; rpm: number } | null>(null);

  const form = useForm<AdsenseFormValues>({
    resolver: zodResolver(adsenseSchema),
    defaultValues: {
      pageImpressions: 100000,
      ctr: 1.5,
      cpc: 0.5,
    },
  });

  const onSubmit = (values: AdsenseFormValues) => {
    const { pageImpressions, ctr, cpc } = values;
    const totalClicks = pageImpressions * (ctr / 100);
    const earnings = totalClicks * cpc;
    const rpm = (earnings / pageImpressions) * 1000;
    setResult({ earnings, rpm });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Google AdSense Calculator</CardTitle>
        <CardDescription>
          Estimate your potential earnings from Google AdSense.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="pageImpressions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Page Impressions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Click-Through Rate (CTR) (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Per Click (CPC)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 0.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Estimated Earnings</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.earnings)}
                  </p>
                </div>
                 <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Estimated Revenue Per 1,000 Impressions (RPM)</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                     {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.rpm)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Earnings
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
