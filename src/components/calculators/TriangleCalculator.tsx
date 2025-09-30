'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { triangleCalculatorSchema } from '@/lib/schemas';

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

type TriangleFormValues = z.infer<typeof triangleCalculatorSchema>;

interface TriangleResult {
  area: number;
  perimeter: number;
}

export default function TriangleCalculator() {
  const [result, setResult] = useState<TriangleResult | null>(null);

  const form = useForm<TriangleFormValues>({
    resolver: zodResolver(triangleCalculatorSchema),
    defaultValues: {
      sideA: 3,
      sideB: 4,
      sideC: 5,
    },
  });

  const onSubmit = (values: TriangleFormValues) => {
    const { sideA, sideB, sideC } = values;

    const perimeter = sideA + sideB + sideC;
    const s = perimeter / 2; // semi-perimeter for Heron's formula
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    setResult({ area, perimeter });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Triangle Calculator</CardTitle>
        <CardDescription>
          Calculate the area and perimeter of a triangle given its three sides.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="sideA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side A</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="sideB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side B</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="sideC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Side C</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Area</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground">
                    {result.area.toFixed(4)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Perimeter</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground">
                    {result.perimeter.toFixed(4)}
                  </p>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
