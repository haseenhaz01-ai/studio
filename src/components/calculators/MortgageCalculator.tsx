'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { emiCalculatorSchema } from '@/lib/schemas';
import { useShareableLink } from '@/hooks/useShareableLink';
import { exportToCsv } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Download, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from 'recharts';

type MortgageFormValues = z.infer<typeof emiCalculatorSchema>;

interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortization: { month: number; principal: number; interest: number; balance: number }[];
}

export default function MortgageCalculator() {
  const [result, setResult] = useState<MortgageResult | null>(null);
  const { toast } = useToast();

  const form = useForm<MortgageFormValues>({
    resolver: zodResolver(emiCalculatorSchema),
    defaultValues: {
      loanAmount: 250000,
      interestRate: 6.5,
      tenure: 30,
    },
  });

  useShareableLink(form, ['loanAmount', 'interestRate', 'tenure']);
  
  const calculateMortgage = (values: MortgageFormValues) => {
    const { loanAmount, interestRate, tenure } = values;
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = tenure * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfMonths <= 0) {
      setResult(null);
      return;
    }

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const totalPayment = monthlyPayment * numberOfMonths;
    const totalInterest = totalPayment - principal;

    const amortization = [];
    let balance = principal;
    for (let i = 1; i <= numberOfMonths; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        amortization.push({
            month: i,
            principal: parseFloat(principalPayment.toFixed(2)),
            interest: parseFloat(interestPayment.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
        });
    }

    setResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
      amortization,
    });
  };

  useEffect(() => {
    calculateMortgage(form.getValues());
    const subscription = form.watch(() => calculateMortgage(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleExport = () => {
    if (!result?.amortization) {
      toast({ variant: 'destructive', title: 'Error', description: 'No data to export.' });
      return;
    }
    exportToCsv(`mortgage-schedule.csv`, result.amortization);
    toast({ title: 'Success', description: 'Amortization schedule exported as CSV.' });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Shareable link has been copied to your clipboard.' });
  };
  
  const chartData = useMemo(() => {
    if (!result?.amortization) return [];
    return result.amortization.map(item => ({...item, year: Math.ceil(item.month/12)}));
  }, [result]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Mortgage Calculator</CardTitle>
        <CardDescription>Calculate your monthly mortgage payments.</CardDescription>
      </CardHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Form {...form}>
          <form className="md:border-r md:pr-8">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1000} max={10000000} step={1000} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (% p.a.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={30} step={0.1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Tenure (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={30} step={1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button type="button" onClick={handleShare} variant="outline" className="w-full"><LinkIcon className="mr-2" /> Share</Button>
                <Button type="button" onClick={handleExport} variant="outline" className="w-full"><Download className="mr-2" /> Export CSV</Button>
            </CardFooter>
          </form>
        </Form>
        <div className="space-y-4 p-4">
            {result && (
                <>
                    <div className="space-y-1 text-center">
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="font-headline text-4xl font-bold text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.monthlyPayment)}</p>
                    </div>
                    <div className="flex justify-around pt-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Interest</p>
                            <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalInterest)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Payment</p>
                            <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalPayment)}</p>
                        </div>
                    </div>
                    <div className="h-64 w-full pt-4">
                      <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" unit="y" tick={{fontSize: 12}} />
                          <YAxis tickFormatter={(val) => new Intl.NumberFormat('en-US', {notation: 'compact'}).format(val)} tick={{fontSize: 12}} />
                          <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            formatter={(value: number, name) => [new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                           />
                          <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrincipal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
      </div>
    </Card>
  );
}
