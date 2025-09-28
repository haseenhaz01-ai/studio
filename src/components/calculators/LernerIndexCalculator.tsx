'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { lernerIndexSchema } from '@/lib/schemas';

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

type LernerIndexFormValues = z.infer<typeof lernerIndexSchema>;

export default function LernerIndexCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<LernerIndexFormValues>({
    resolver: zodResolver(lernerIndexSchema),
    defaultValues: {
      price: 100,
      marginalCost: 60,
    },
  });

  const onSubmit = (values: LernerIndexFormValues) => {
    const { price, marginalCost } = values;
    if (price > 0) {
      const lernerIndex = (price - marginalCost) / price;
      setResult(lernerIndex);
    } else {
        setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Lerner Index Calculator</CardTitle>
        <CardDescription>
          Calculate a firm's market power.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marginalCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marginal Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result !== null && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Lerner Index</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Lerner Index
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
