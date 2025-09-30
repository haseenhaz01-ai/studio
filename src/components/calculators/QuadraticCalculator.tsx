'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { quadraticSchema } from '@/lib/schemas';

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

type QuadraticFormValues = z.infer<typeof quadraticSchema>;

interface QuadraticResult {
  root1: string;
  root2: string;
}

export default function QuadraticCalculator() {
  const [result, setResult] = useState<QuadraticResult | null>(null);

  const form = useForm<QuadraticFormValues>({
    resolver: zodResolver(quadraticSchema),
    defaultValues: {
      a: 1,
      b: -3,
      c: 2,
    },
  });

  const onSubmit = (values: QuadraticFormValues) => {
    const { a, b, c } = values;
    const discriminant = b * b - 4 * a * c;

    let root1: string;
    let root2: string;

    if (discriminant > 0) {
      // Two distinct real roots
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      root1 = r1.toFixed(4);
      root2 = r2.toFixed(4);
    } else if (discriminant === 0) {
      // One real root
      const r = -b / (2 * a);
      root1 = root2 = r.toFixed(4);
    } else {
      // Two complex roots
      const realPart = (-b / (2 * a)).toFixed(4);
      const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      root1 = `${realPart} + ${imagPart}i`;
      root2 = `${realPart} - ${imagPart}i`;
    }

    setResult({ root1, root2 });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Quadratic Formula Calculator</CardTitle>
        <CardDescription>
          Solve equations of the form ax² + bx + c = 0
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="a"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coefficient a</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="b"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coefficient b</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="c"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coefficient c</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Root 1 (x₁)</p>
                  <p className="font-headline text-2xl font-bold text-accent-foreground break-words">
                    {result.root1}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Root 2 (x₂)</p>
                  <p className="font-headline text-2xl font-bold text-primary-foreground break-words">
                    {result.root2}
                  </p>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Roots
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
