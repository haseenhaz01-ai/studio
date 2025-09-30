'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { randomNumberGeneratorSchema } from '@/lib/schemas';

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

type RandomNumberFormValues = z.infer<typeof randomNumberGeneratorSchema>;

export default function RandomNumberGenerator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<RandomNumberFormValues>({
    resolver: zodResolver(randomNumberGeneratorSchema),
    defaultValues: {
      min: 1,
      max: 100,
    },
  });

  const onSubmit = (values: RandomNumberFormValues) => {
    const { min, max } = values;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(randomNumber);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Random Number Generator</CardTitle>
        <CardDescription>
          Generate a random number within a specified range.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {result !== null && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6 text-center">
                <p className="text-sm text-accent-foreground/80">Your Random Number</p>
                <p className="font-headline text-5xl font-bold text-accent-foreground">
                  {result}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Generate Number
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
