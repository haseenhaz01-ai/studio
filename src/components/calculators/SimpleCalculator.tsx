'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { simpleCalculatorSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SimpleCalculatorFormValues = z.infer<typeof simpleCalculatorSchema>;

export default function SimpleCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm<SimpleCalculatorFormValues>({
    resolver: zodResolver(simpleCalculatorSchema),
    defaultValues: {
      number1: 0,
      number2: 0,
      operation: 'add',
    },
  });

  const onSubmit = (values: SimpleCalculatorFormValues) => {
    const { number1, number2, operation } = values;
    let calculationResult: number;
    switch (operation) {
      case 'add':
        calculationResult = number1 + number2;
        break;
      case 'subtract':
        calculationResult = number1 - number2;
        break;
      case 'multiply':
        calculationResult = number1 * number2;
        break;
      case 'divide':
        calculationResult = number1 / number2;
        break;
      default:
        calculationResult = 0;
    }
    setResult(calculationResult);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Simple Calculator</CardTitle>
        <CardDescription>Perform basic arithmetic operations.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr,150px,1fr]">
              <FormField
                control={form.control}
                name="number1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number 1</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an operation" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="add">+</SelectItem>
                            <SelectItem value="subtract">-</SelectItem>
                            <SelectItem value="multiply">*</SelectItem>
                            <SelectItem value="divide">/</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number 2</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {result !== null && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                <p className="text-sm text-accent-foreground/80">Result</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground">
                  {result}
                </p>
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
