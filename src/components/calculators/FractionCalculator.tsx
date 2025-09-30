'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { fractionSchema } from '@/lib/schemas';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type FractionFormValues = z.infer<typeof fractionSchema>;

interface FractionResult {
  numerator: number;
  denominator: number;
}

// Greatest Common Divisor function
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const simplifyFraction = (numerator: number, denominator: number): FractionResult => {
  if (denominator === 0) return { numerator, denominator }; // Avoid division by zero
  const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
  const newNumerator = numerator / commonDivisor;
  const newDenominator = denominator / commonDivisor;

  // Ensure denominator is positive
  if (newDenominator < 0) {
    return { numerator: -newNumerator, denominator: -newDenominator };
  }
  return { numerator: newNumerator, denominator: newDenominator };
};

export default function FractionCalculator() {
  const [result, setResult] = useState<FractionResult | null>(null);

  const form = useForm<FractionFormValues>({
    resolver: zodResolver(fractionSchema),
    defaultValues: {
      numerator1: 1,
      denominator1: 2,
      numerator2: 3,
      denominator2: 4,
      operation: 'add',
    },
  });

  const onSubmit = (values: FractionFormValues) => {
    const { numerator1, denominator1, numerator2, denominator2, operation } = values;
    let resultNum = 0;
    let resultDen = 1;

    switch (operation) {
      case 'add':
        resultNum = numerator1 * denominator2 + numerator2 * denominator1;
        resultDen = denominator1 * denominator2;
        break;
      case 'subtract':
        resultNum = numerator1 * denominator2 - numerator2 * denominator1;
        resultDen = denominator1 * denominator2;
        break;
      case 'multiply':
        resultNum = numerator1 * numerator2;
        resultDen = denominator1 * denominator2;
        break;
      case 'divide':
        resultNum = numerator1 * denominator2;
        resultDen = denominator1 * numerator2;
        break;
    }
    
    if (resultDen === 0) {
        form.setError("root", { type: "manual", message: "Result has a zero denominator." });
        setResult(null);
        return;
    }

    const simplified = simplifyFraction(resultNum, resultDen);
    setResult(simplified);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Fraction Calculator</CardTitle>
        <CardDescription>
          Perform arithmetic operations on fractions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              {/* First Fraction */}
              <div className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="numerator1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="w-24 text-center" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-2 w-24" />
                <FormField
                  control={form.control}
                  name="denominator1"
                  render={({ field }) => (
                     <FormItem>
                      <FormControl>
                        <Input type="number" className="w-24 text-center" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Operation */}
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="add">+</SelectItem>
                        <SelectItem value="subtract">-</SelectItem>
                        <SelectItem value="multiply">×</SelectItem>
                        <SelectItem value="divide">÷</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Second Fraction */}
              <div className="flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="numerator2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="w-24 text-center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-2 w-24" />
                <FormField
                  control={form.control}
                  name="denominator2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" className="w-24 text-center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}

            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6 text-center">
                <p className="text-sm text-accent-foreground/80">Result</p>
                <div className="font-headline text-4xl font-bold text-accent-foreground flex items-center justify-center">
                  {result.denominator === 1 ? (
                    <span>{result.numerator}</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span>{result.numerator}</span>
                      <Separator className="my-1 bg-accent-foreground h-[2px] w-16" />
                      <span>{result.denominator}</span>
                    </div>
                  )}
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
