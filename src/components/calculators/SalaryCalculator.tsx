'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { paycheckCalculatorSchema } from '@/lib/schemas';
import { handleIncomeTaxCalculation } from '@/lib/actions';
import { US_STATES } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PaycheckFormValues = z.infer<typeof paycheckCalculatorSchema>;
type PaycheckResult = {
  netPay: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
};


export default function SalaryCalculator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<PaycheckResult | null>(null);

  const form = useForm<PaycheckFormValues>({
    resolver: zodResolver(paycheckCalculatorSchema),
    defaultValues: {
      grossPay: 50000,
      payFrequency: 'annually',
      filingStatus: 'single',
      state: 'CA',
    },
  });

  const onSubmit = (values: PaycheckFormValues) => {
    setResult(null);
    startTransition(async () => {
      const response = await handleIncomeTaxCalculation(values);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
      if (response.success) {
        setResult(response.success);
      }
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Salary Calculator</CardTitle>
        <CardDescription>Estimate your take-home pay with our AI-powered calculator.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="grossPay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Pay</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay Frequency</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="filingStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Federal Filing Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                        <SelectItem value="married_separately">Married Filing Separately</SelectItem>
                        <SelectItem value="head_of_household">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {isPending && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></div>}

            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Net Pay (Take-Home)</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.netPay)}
                  </p>
                </div>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Gross Pay</p>
                        <p className="font-headline text-lg font-bold text-primary-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.grossPay)}
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Federal Tax</p>
                        <p className="font-headline text-lg font-bold text-primary-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.federalTax)}
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">State Tax</p>
                        <p className="font-headline text-lg font-bold text-primary-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.stateTax)}
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-muted bg-muted/20 p-4">
                        <p className="text-sm text-muted-foreground/80">Social Security</p>
                        <p className="font-headline text-lg font-bold text-muted-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.socialSecurity)}
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-muted bg-muted/20 p-4">
                        <p className="text-sm text-muted-foreground/80">Medicare</p>
                        <p className="font-headline text-lg font-bold text-muted-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.medicare)}
                        </p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calculate Salary'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
