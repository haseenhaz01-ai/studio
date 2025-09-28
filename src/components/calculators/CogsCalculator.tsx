'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { cogsSchema } from '@/lib/schemas';

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

type CogsFormValues = z.infer<typeof cogsSchema>;

export default function CogsCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<CogsFormValues>({
    resolver: zodResolver(cogsSchema),
    defaultValues: {
      beginningInventory: 15000,
      purchases: 20000,
      endingInventory: 10000,
    },
  });

  const onSubmit = (values: CogsFormValues) => {
    const { beginningInventory, purchases, endingInventory } = values;
    const cogs = beginningInventory + purchases - endingInventory;
    setResult(cogs);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Cost of Goods Sold (COGS) Calculator</CardTitle>
        <CardDescription>
          Calculate the direct cost of goods sold during a period.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="beginningInventory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beginning Inventory</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchases / Additions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 20000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endingInventory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ending Inventory</FormLabel>
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
                  <p className="text-sm text-accent-foreground/80">Cost of Goods Sold (COGS)</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate COGS
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
