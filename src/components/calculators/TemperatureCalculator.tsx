'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { temperatureConversionSchema } from '@/lib/schemas';
import { TEMPERATURE_UNITS } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

type TemperatureFormValues = z.infer<typeof temperatureConversionSchema>;

export default function TemperatureCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<TemperatureFormValues>({
    resolver: zodResolver(temperatureConversionSchema),
    defaultValues: {
      amount: 0,
      fromUnit: 'celsius',
      toUnit: 'fahrenheit',
    },
  });

  const onSubmit = (values: TemperatureFormValues) => {
    const { amount, fromUnit, toUnit } = values;
    let convertedAmount: number;

    // Convert input to Celsius first
    let amountInCelsius: number;
    switch (fromUnit) {
        case 'celsius':
            amountInCelsius = amount;
            break;
        case 'fahrenheit':
            amountInCelsius = (amount - 32) * 5/9;
            break;
        case 'kelvin':
            amountInCelsius = amount - 273.15;
            break;
    }

    // Convert from Celsius to the target unit
    switch (toUnit) {
        case 'celsius':
            convertedAmount = amountInCelsius;
            break;
        case 'fahrenheit':
            convertedAmount = (amountInCelsius * 9/5) + 32;
            break;
        case 'kelvin':
            convertedAmount = amountInCelsius + 273.15;
            break;
    }
    
    const formattedResult = Number(convertedAmount.toPrecision(10)).toString();
    setResult(`${formattedResult} °${toUnit.charAt(0).toUpperCase()}`);
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
        <CardTitle className="font-headline">Temperature Converter</CardTitle>
        <CardDescription>Convert between Celsius, Fahrenheit, and Kelvin.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
                        {TEMPERATURE_UNITS.map((u) => (
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
                        {TEMPERATURE_UNITS.map((u) => (
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
                <p className="text-sm text-accent-foreground/80">Converted Temperature</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground break-all">
                  {result}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Convert Temperature
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
