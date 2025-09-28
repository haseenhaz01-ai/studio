'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { currencyConversionSchema } from '@/lib/schemas';
import { handleCurrencyConversion } from '@/lib/actions';
import { CURRENCIES } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CurrencyFormValues = z.infer<typeof currencyConversionSchema>;

export default function CurrencyConverter() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<{ amount: number; target: string } | null>(null);

  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyConversionSchema),
    defaultValues: {
      amount: 100,
      sourceCurrency: 'USD',
      targetCurrency: 'EUR',
    },
  });

  const onSubmit = (values: CurrencyFormValues) => {
    setResult(null);
    startTransition(async () => {
      const response = await handleCurrencyConversion(values);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
      if (response.success) {
        setResult({ amount: response.success.convertedAmount, target: values.targetCurrency });
      }
    });
  };

  const swapCurrencies = () => {
    const source = form.getValues('sourceCurrency');
    const target = form.getValues('targetCurrency');
    form.setValue('sourceCurrency', target);
    form.setValue('targetCurrency', source);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Currency Converter</CardTitle>
        <CardDescription>Get real-time exchange rates powered by AI.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[2fr,auto,2fr]">
              <FormField
                control={form.control}
                name="sourceCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" className="w-full" onClick={swapCurrencies} aria-label="Swap currencies">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              <FormField
                control={form.control}
                name="targetCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                <p className="text-sm text-accent-foreground/80">Converted Amount</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: result.target }).format(result.amount)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Convert'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
