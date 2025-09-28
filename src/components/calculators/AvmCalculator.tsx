'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { avmSchema } from '@/lib/schemas';

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

type AvmFormValues = z.infer<typeof avmSchema>;

export default function AvmCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<AvmFormValues>({
    resolver: zodResolver(avmSchema),
    defaultValues: {
      totalWatchTime: 6000,
      totalViews: 2000,
    },
  });

  const onSubmit = (values: AvmFormValues) => {
    const { totalWatchTime, totalViews } = values;
    if (totalViews > 0) {
      const averageViewTimeSeconds = totalWatchTime / totalViews;
      const minutes = Math.floor(averageViewTimeSeconds / 60);
      const seconds = Math.round(averageViewTimeSeconds % 60);
      setResult(`${minutes}m ${seconds}s`);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Average View Time (AVM) Calculator</CardTitle>
        <CardDescription>
          Calculate the average time viewers spend watching your videos.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="totalWatchTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Watch Time (in seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 6000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalViews"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Number of Views</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result !== null && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Average View Time</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate AVM
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
