'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { lengthConversionSchema } from '@/lib/schemas';
import { LENGTH_UNITS, LENGTH_CONVERSION_FACTORS } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

type LengthFormValues = z.infer<typeof lengthConversionSchema>;

export default function LengthCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<LengthFormValues>({
    resolver: zodResolver(lengthConversionSchema),
    defaultValues: {
      amount: 1,
      fromUnit: 'meters',
      toUnit: 'feet',
    },
  });

  const onSubmit = (values: LengthFormValues) => {
    const { amount, fromUnit, toUnit } = values;
    const amountInMeters = amount * LENGTH_CONVERSION_FACTORS[fromUnit];
    const convertedAmount = amountInMeters / LENGTH_CONVERSION_FACTORS[toUnit];
    
    // Format to a reasonable number of decimal places
    const formattedResult = Number(convertedAmount.toPrecision(10)).toString();
    setResult(`${formattedResult} ${toUnit}`);
  };

  const swapUnits = () => {
    const from = form.getValues('fromUnit');
    const to = form.getValues('toUnit');
    form.setValue('fromUnit', to);
    form.setValue('toUnit', from);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Length Converter</CardTitle>
        <CardDescription>Convert between different units of length.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[2fr,auto,2fr]">
              <FormField
                control={form.control}
                name="fromUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LENGTH_UNITS.map((u) => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" className="w-full" onClick={swapUnits} aria-label="Swap units">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              <FormField
                control={form.control}
                name="toUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LENGTH_UNITS.map((u) => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                <p className="text-sm text-accent-foreground/80">Converted Length</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground break-all">
                  {result}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Convert Length
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
